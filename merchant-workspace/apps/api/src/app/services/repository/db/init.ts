import { DB } from './main'
import { Database } from 'sqlite3'
import connection from './connection'

class InitDB extends DB {
  constructor(db: Database) {
    super(db)
  }

  public async initHandler(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`CREATE TABLE IF NOT EXISTS account (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                firstname VARCHAR (255) NOT NULL,
                lastname VARCHAR (255) NOT NULL,
                password TEXT NOT NULL,
                email VARCHAR (255) UNIQUE NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`)

        this.db.run(`CREATE TABLE IF NOT EXISTS company (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                account_id INT NOT NULL,
                name VARCHAR (255) NOT NULL,
                street VARCHAR (255) NOT NULL,
                bulding_number VARCHAR (255),
                locality VARCHAR (255),
                postal_code VARCHAR (255) NOT NULL,
                city VARCHAR (255) NOT NULL,
                country VARCHAR (255) NOT NULL,
                nip CHAR (10) NOT NULL,
                bank_account VARCHAR (255) NOT NULL,
                bank_name VARCHAR (255),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (account_id)
                    REFERENCES account (id)
            );`)

        this.db.run(`CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                account_id INT NOT NULL,
                bussines_activity_code VARCHAR (255),
                invoice_number_schema VARCHAR (255),
                payment_period VARCHAR (255),
                currency VARCHAR (255),
                FOREIGN KEY (account_id)
                    REFERENCES account (id)
            );`)

        this.db.run(`CREATE TABLE IF NOT EXISTS customer (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                account_id INT NOT NULL,
                name VARCHAR (255) NOT NULL,
                street VARCHAR (255) NOT NULL,
                bulding_number VARCHAR (255),
                locality VARCHAR (255),
                postal_code VARCHAR (255) NOT NULL,
                city VARCHAR (255) NOT NULL,
                country VARCHAR (255) NOT NULL,
                nip CHAR (10) NOT NULL,
                bank_account VARCHAR (255) NOT NULL,
                bank_name VARCHAR (255),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (account_id)
                    REFERENCES account (id)
            );`)

        this.db.run(`CREATE TABLE IF NOT EXISTS invoice (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                account_id INT NOT NULL,
                customer_id INT NOT NULL,
                invoice_number VARCHAR (255) NOT NULL,
                price_net DOUBLE PRECISION NOT NULL,
                price DOUBLE PRECISION NOT NULL,
                vat DOUBLE PRECISION NOT NULL,
                currency VARCHAR (255) NOT NULL,
                invoice_date TEXT NOT NULL,
                payment_date TEXT NOT NULL,
                payment_period VARCHAR (255),
                service_period VARCHAR (255),
                author VARCHAR (255),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (account_id)
                    REFERENCES account (id),
                FOREIGN KEY (customer_id)
                    REFERENCES customer (id)
            );`)

        this.db.run(`CREATE TABLE IF NOT EXISTS invoice_position (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                invoice_id INT NOT NULL,
                position_name VARCHAR (255) NOT NULL,
                business_activity_code VARCHAR (255),
                measurement varchar (5) NOT NULL,
                amount INT NOT NULL,
                price_net DOUBLE PRECISION NOT NULL,
                price DOUBLE PRECISION NOT NULL,
                vat DOUBLE PRECISION NOT NULL,
                vat_rate TINYINT NOT NULL,
                total_value_net DOUBLE PRECISION NOT NULL,
                total_value DOUBLE PRECISION NOT NULL,
                currency VARCHAR (255) NOT NULL,
                FOREIGN KEY (invoice_id)
                    REFERENCES invoice (id)
            );`)
      })

      this.db.prepare('SELECT * FROM account', (err) => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  }

  public async initTestAccountData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`INSERT INTO account (firstname, lastname, password, email) VALUES 
          ('Krishna', 'Carnalan', 'z9Bcu06', 'kcarnalan0@yellowpages.com'),
          ('Aldo', 'Djorevic', 'uZG5tPSVDX', 'adjorevic1@loc.gov'),
          ('Howie', 'Mix', 'xz8NMuYXt4M', 'hmix2@ask.com'),
          ('Gustav', 'Craigmile', 'h71aesLPwHZ', 'gcraigmile3@rediff.com'),
          ('Gabrielle', 'Cadany', 'DbcTQKAWJ', 'gcadany4@histats.com');`)
      })

      this.db.prepare('SELECT * FROM account', (err) => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  }

  public async initTestCompanyData(accountId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`INSERT INTO company (
          account_id, name, street, bulding_number, locality, postal_code, city, country, nip, bank_account, bank_name
        ) VALUES 
          (${accountId}, 'Otcom','Hallows','9','1','18-500','Kolno','Poland','1789442890','32168545031438073902','Stim Bank'),
          (${accountId}, 'Namfix','Redwing','03','5','90-360','Zbytków','Poland','5983075519','44422159652897351161','Flowdesk Bank'),
          (${accountId}, 'Mat Lam Tam','Buena Vista','888','1','64-630','Ryczywół','Poland','9954598880','76618335797783923466','Trippledex Bank'),
          (${accountId}, 'Stronghold','Harbort','329','87','75-571','Osiek nad Notecią','Poland','3176427991','74342351246453927637','Prodder Bank'),
          (${accountId}, 'Transcof','Montana','206','102','38-123','Wysoka Strzyżowska','Poland','7195596289','65693911804359744968','Hatity Bank'),
          (${accountId}, 'Fintone','Kensington','92','25','34-105','Radocza','Poland','9729326333','27436131917979079435','Flexidy Bank');`)
      })

      this.db.prepare('SELECT * FROM company', (err) => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  }

  public async initTestCustomerData(accountId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`INSERT INTO customer (
          account_id, name, street, bulding_number, locality, postal_code, city, country, nip, bank_account, bank_name
        ) VALUES 
          (${accountId},'Otcom','Hallows','9','1','18-500','Kolno','Poland','1789442890','32168545031438073902','Stim Bank'),
          (${accountId},'Namfix','Redwing','03','5','90-360','Zbytków','Poland','5983075519','44422159652897351161','Flowdesk Bank'),
          (${accountId},'Mat Lam Tam','Buena Vista','888','1','64-630','Ryczywół','Poland','9954598880','76618335797783923466','Trippledex Bank'),
          (${accountId},'Stronghold','Harbort','329','87','75-571','Osiek nad Notecią','Poland','3176427991','74342351246453927637','Prodder Bank'),
          (${accountId},'Transcof','Montana','206','102','38-123','Wysoka Strzyżowska','Poland','7195596289','65693911804359744968','Hatity Bank'),
          (${accountId},'Fintone','Kensington','92','25','34-105','Radocza','Poland','9729326333','27436131917979079435','Flexidy Bank');`)
      })

      this.db.prepare('SELECT * FROM customer', (err) => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  }

  public async initTestInvoiceData(accountId: number, customerId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`INSERT INTO invoice (
          account_id, 
          customer_id, 
          invoice_number, 
          price_net, 
          price, 
          vat, 
          currency, 
          invoice_date, 
          payment_date, 
          payment_period, 
          service_period,
          author
        ) VALUES 
          (${accountId},${customerId},'abc001',1000,1230,230,'PLN',
          '${new Date('2021-04-30').toISOString()}',
          '${new Date('2021-05-07').toISOString()}', 
          '7 dni', '01-04-2021 - 30-04-2021', 'Roberto Firmino'),
          (${accountId},${customerId},'abc002',1000,1230,230,'PLN',
          '${new Date('2021-05-31').toISOString()}',
          '${new Date('2021-06-07').toISOString()}', 
          '7 dni', '01-05-2021 - 31-05-2021', 'Roberto Firmino'),
          (${accountId},${customerId},'abc003',1000,1230,230,'PLN',
          '${new Date('2021-06-30').toISOString()}',
          '${new Date('2021-07-07').toISOString()}', 
          '7 dni', '01-06-2021 - 30-06-2021', 'Roberto Firmino'),
          (${accountId},${customerId},'abc004',1000,1230,230,'PLN',
          '${new Date('2021-07-31').toISOString()}',
          '${new Date('2021-08-07').toISOString()}', 
          '7 dni', '01-07-2021 - 31-07-2021', 'Roberto Firmino');`)
      })

      this.db.prepare('SELECT * FROM invoice', (err) => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  }

  public async initTestInvoicePositionData(invoiceId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`INSERT INTO invoice_position (
          invoice_id,
          position_name,
          business_activity_code,
          measurement,
          amount,
          price_net,
          price,
          vat,
          vat_rate,
          total_value_net,
          total_value,
          currency
        ) VALUES 
          (${invoiceId},'Software developing','62.01.Z','szt.',1,500,615,115,23,500,615,'PLN'),
          (${invoiceId},'Software designing','62.01.Z','szt.',1,500,615,115,23,500,615,'PLN');`)
      })

      this.db.prepare('SELECT * FROM invoice_position', (err) => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  }

  public async deleteData(): Promise<any> {
    const deleteInvoicePosition = new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM invoice_position`, (err) => {
        if (err) {
          reject(err)
        }

        resolve('invoice position deleted')
      })
    })

    const deleteInvoice = new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM invoice`, (err) => {
        if (err) {
          reject(err)
        }

        resolve('invoice deleted')
      })
    })

    const deleteCustomer = new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM customer`, (err) => {
        if (err) {
          reject(err)
        }

        resolve('customer deleted')
      })
    })

    const deleteCompany = new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM company`, (err) => {
        if (err) {
          reject(err)
        }

        resolve('company deleted')
      })
    })
    const deleteAccount = new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM account`, (err) => {
        if (err) {
          reject(err)
        }

        resolve('account deleted')
      })
    })

    const results = []
    for await (const query of [
      deleteInvoicePosition,
      deleteInvoice,
      deleteCustomer,
      deleteCompany,
      deleteAccount,
    ]) {
      const result = await query
      results.push(result)
    }

    return results
  }
}

export default new InitDB(connection)
