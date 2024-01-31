import { createConnection } from 'mysql2/promise'
import { CONFIG } from './config.js'

export const DBConn = await createConnection(CONFIG.database)

DBConn.connect()
