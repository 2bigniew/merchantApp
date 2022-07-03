import * as sqlite3 from 'sqlite3'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve('.env') })

const getDbName = (): string => {
  if (process.env.MERCHANT_PROD === 'in_progress') {
    return process.env.PROD_DB_NAME!
  }

  if (
    process.env.NODE_ENV === 'test' ||
    process.env.JEST_WORKER_ID ||
    process.env.NODE_ENV === 'development'
  ) {
    return process.env.TEST_DB_NAME || 'merchant_db_test_default'
  }

  return process.env.DB_NAME || 'merchant_db_default'
}

const connection = new sqlite3.Database(getDbName())
export default connection
