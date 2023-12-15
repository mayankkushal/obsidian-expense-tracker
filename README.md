# Obsidian Simple PTA

Welcome to Simple PTA, your personal finance tracker within Obsidian!

## Transaction

### Structure of Transactions
Simple PTA uses a simple, text-based format for recording transactions. Each transaction consists of three parts:

1. **Date**: The date of the transaction, written in the format YYYY-MM-DD.
2. **Description**: A short description of the transaction.
3. **Accounts and Amounts**: A list of accounts involved in the transaction and their respective amounts.

A transaction entry follows the format:
```plaintext
<date> "<description>"
<space><account> <amount><currency>
<space><account> <amount><currency>
...
<space><account>
```
**Breakdown:**

- 2023-12-10: The date of the transaction.
- "Lunch": A short description of the transaction.
- Expenses:Food:Lunch 110.00INR: This specifies the account used (Expenses:Food:Lunch) and the amount spent (110.00INR).
- Assets:Bank:HDFC: This specifies the account that money was sent from.


> [!NOTE] 
> - The amount and currency are optional for the last account. It is automatically calculated as the negative of the sum of all positive amounts listed.
> - You can create custom accounts and sub-accounts to categorize your finances.

### Recording Transactions
Simple PTA offers two convenient ways to record your transactions:

1. Adding directly in the ledger.md file:

   - Open your ledger file in Obsidian.
   - Follow the transaction structure outlined in the previous section:
     - Date (YYYY-MM-DD)
     - Description
     - Accounts (separated by spaces)
     - Amounts (optional for last account, calculated automatically)

   Example:

   ```2023-12-14 "Movie Ticket"
     Expenses:Entertainment:Movie 150 INR
     Assets:Bank:ICICI
   ```

2. Using the transaction modal:

   - Click the Simple PTA button on the Obsidian ribbon menu.
   - This opens the transaction modal where you can easily enter the details.
   - Click "Submit" to record the transaction.

> [!TIP]
> You can create a shortcut on your mobile device to directly open the transaction modal. Use the Obsidian URI `obsidian://simple-pta` when creating the shortcut.

### Example
```plaintext
2023-12-10 "Lunch"
 Expenses:Food:Lunch 110.00INR
 Assets:Bank:HDFC

2023-12-09 "Dinner"
 Expenses:Food:Dinner 150.00INR
 Assets:Bank:HDFC

```

## Simple PTA Query Language

### Structure and Syntax

```
selectKey filterClause*
```

- selectKey: Defines the desired output. Choose balance to explore account balances, or transaction to delve into transaction details.
- filterClause (optional, multiple allowed): Refines the data based on specific criteria. Each clause consists of:
  - filterKey: Identifies the aspect to filter (e.g., account, date, structure).
  - operator: 
  - value: Provides the details to compare against. Allowed values differ for each filterKey.


#### Valid filers for balance query:

| Filter Key | Operator      | Value                                    |
|------------|---------------|------------------------------------------|
| account    |               | Regex of account name ex: Expense:Food.* |
| date       | last, current | day, week, month, year                   |
| structure  |               | flat, nested                             |

> [!NOTE]
> account is required for balance queries

#### Valid filers for transaction query:

| Filter Key | Operator      | Value                                    |
|------------|---------------|------------------------------------------|
| account    |               | Regex of account name ex: Expense:Food.* |
| date       | last, current | day, week, month, year                   |
| structure  |               | flat, nested                             |
| limit      | first, last   | <number>                                 |
| order      | asc, desc     | amount, date                             |

### Examples

````
```pta
balance
account *
structure flat
```
````
This gives balance for all the root level accounts in a flat structure

````
```pta
balance
account Expenses.Food.*
date current month
structure nested
```
````
This gives balance for all the sub-accounts of Expenses:Food in a nested structure


````
```pta
transaction
date current month
structure nested
order asc date
order desc amount
limit last 5
```
````
This gives the last 5 transactions in a nested structure, sorted by date in ascending order and amount in the descending order
