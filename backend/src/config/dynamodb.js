import { 
  DynamoDBClient, 
  CreateTableCommand, 
  DescribeTableCommand,
  ListTablesCommand
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-south-1';

const clientConfig = {
  region,
};

// Check if credentials are provided in environment
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  };
}

if (process.env.DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
}

export const ddbRawClient = new DynamoDBClient(clientConfig);

export const ddbDocClient = DynamoDBDocumentClient.from(ddbRawClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  },
});

export const TABLE_NAMES = {
  REGISTRANTS: process.env.DYNAMODB_REGISTRANTS_TABLE || 'HackSeries_Registrants',
  STAFF: process.env.DYNAMODB_STAFF_TABLE || 'HackSeries_StaffUsers',
  CONFIG: process.env.DYNAMODB_CONFIG_TABLE || 'HackSeries_EventConfig',
};

/**
 * Ensure all DynamoDB tables exist and are initialized
 */
export const initDynamoDB = async () => {
  console.log(`🔄 [DynamoDB] Connecting to AWS DynamoDB (Region: ${region})...`);
  
  try {
    const listRes = await ddbRawClient.send(new ListTablesCommand({}));
    const existingTables = new Set(listRes.TableNames || []);

    // 1. Registrants Table (PK: uniqueId, GSI: email-index)
    if (!existingTables.has(TABLE_NAMES.REGISTRANTS)) {
      console.log(`📦 [DynamoDB] Creating Table: ${TABLE_NAMES.REGISTRANTS}...`);
      await ddbRawClient.send(
        new CreateTableCommand({
          TableName: TABLE_NAMES.REGISTRANTS,
          KeySchema: [{ AttributeName: 'uniqueId', KeyType: 'HASH' }],
          AttributeDefinitions: [
            { AttributeName: 'uniqueId', AttributeType: 'S' },
            { AttributeName: 'email', AttributeType: 'S' },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'email-index',
              KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
              Projection: { ProjectionType: 'ALL' },
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        })
      );
      console.log(`✅ [DynamoDB] Table ${TABLE_NAMES.REGISTRANTS} created.`);
    }

    // 2. StaffUsers Table (PK: username)
    if (!existingTables.has(TABLE_NAMES.STAFF)) {
      console.log(`📦 [DynamoDB] Creating Table: ${TABLE_NAMES.STAFF}...`);
      await ddbRawClient.send(
        new CreateTableCommand({
          TableName: TABLE_NAMES.STAFF,
          KeySchema: [{ AttributeName: 'username', KeyType: 'HASH' }],
          AttributeDefinitions: [
            { AttributeName: 'username', AttributeType: 'S' },
            { AttributeName: 'email', AttributeType: 'S' },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'staff-email-index',
              KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
              Projection: { ProjectionType: 'ALL' },
            },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        })
      );
      console.log(`✅ [DynamoDB] Table ${TABLE_NAMES.STAFF} created.`);
    }

    // 3. EventConfig Table (PK: configKey)
    if (!existingTables.has(TABLE_NAMES.CONFIG)) {
      console.log(`📦 [DynamoDB] Creating Table: ${TABLE_NAMES.CONFIG}...`);
      await ddbRawClient.send(
        new CreateTableCommand({
          TableName: TABLE_NAMES.CONFIG,
          KeySchema: [{ AttributeName: 'configKey', KeyType: 'HASH' }],
          AttributeDefinitions: [{ AttributeName: 'configKey', AttributeType: 'S' }],
          BillingMode: 'PAY_PER_REQUEST',
        })
      );
      console.log(`✅ [DynamoDB] Table ${TABLE_NAMES.CONFIG} created.`);
    }

    console.log('✅ [DynamoDB] All DynamoDB tables ready.');
    return true;
  } catch (err) {
    console.warn('⚠️ [DynamoDB] Initialization check notice:', err.message);
    // If credentials are not configured yet, don't crash startup; allow fallback/lazy connection
    return false;
  }
};
