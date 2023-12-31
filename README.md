# Obsidian Expense Tracker

Welcome to Expense Tracker, your personal finance tracker within Obsidian!

## Transaction

### Structure of Transactions
Expense Tracker uses a simple, text-based format for recording transactions. Each transaction consists of three parts:

1. **Date**: The date of the transaction, written in the format YYYY-MM-DD.
2. **Description**: A short description of the transaction.
3. **Accounts and Amounts**: A list of accounts involved in the transaction and their respective amounts.

A transaction entry follows the format:
```plaintext
<date> "<description>"
<account> <amount><currency>
<account> <amount><currency>
...
<account>
```

Example:

   ```plaintext
   2023-12-14 "Movie Ticket"
     Expenses:Entertainment:Movie 150 INR
     Assets:Bank:ICICI
   ```

**Breakdown:**

- 2023-12-14: The date of the transaction.
- "Movie Ticket": A short description of the transaction.
- Expenses:Entertainment:Movie 110.00INR: This specifies the account used (Expenses:Food:Lunch) and the amount spent (110.00INR).
- Assets:Bank:ICICI: This specifies the account that money was sent from.

> [!NOTE]
>
> - The amount and currency are optional for the last account. It is automatically calculated as the negative of the sum of all positive amounts listed.
>
> - You can create custom accounts and sub-accounts to categorize your finances.

#### Recurring Transactions

Recurring transactions are also supported, once added, the transaction for it is automatically added to the ledger till the end date or till
manually stopped

A transaction entry follows the format:
```plaintext
<date> <interval> <frequency> <end date> "<description>"
<account> <amount><currency>
<account> <amount><currency>
...
<account>
```

Example

```plaintext
2023-12-14 3 month 2024-06-14 "Netflix"
Expenses:Entertainment:Online 1000 INR
Assets:Bank:ICICI
```

This means that, create a transaction every 3 month on 14th for "Netflix" till 2024-06-14.
It creates this entry in the  ledger
```plaintext
2023-12-14 created "Netflix"
2023-12-14 "Netflix"
Expenses:Entertainment:Online 1000 INR
Assets:Bank:ICICI
```

> [!NOTE]
> Description is very important here, it is used as unique key to identify the recurring transactions

`2023-12-14 created "Netflix"` - denotes that last entry was created on 2023-12-14. This can be used to skip a certain transaction.
For example, if we do not want the system to add a transaction for the next iteration, we can add `2024-03-14 created "Netflix"` to the ledger

`2024-03-14 ended "Netflix"` - this can be added to the ledger to manually end this recurring transaction.


### Recording Transactions
Expense Tracker offers two convenient ways to record your transactions:

1. Adding directly in the ledger.md file:

   - Open your ledger file in Obsidian.
   - Follow the transaction structure outlined in the previous section:
     - Date (YYYY-MM-DD)
     - Description
     - Accounts (separated by spaces)
     - Amounts (optional for last account, calculated automatically)

2. Using the add transaction modal:

   - Click the Expense Tracker button on the Obsidian ribbon menu.
   - This opens the transaction modal where you can easily enter the details.
   - Click "Submit" to record the transaction.

> [!TIP]
> You can use the amount input as a calculator and put mathematical expression there

> [!TIP]
> You can create a shortcut on your mobile device to directly open the transaction modal. Use the Obsidian URI `obsidian://expense-tracker` when creating the shortcut.

### Example
```plaintext
2023-12-10 "Lunch"
 Expenses:Food:Lunch 110.00INR
 Assets:Bank:HDFC

2023-12-09 "Dinner"
 Expenses:Food:Dinner 150.00INR
 Assets:Bank:HDFC

```

## Expense Tracker Query Language

### Structure and Syntax

```
selectKey filterClause* excludeClause*
```

- selectKey: Defines the desired output. Choose balance to explore account balances, or transaction to delve into transaction details.
- filterClause (optional, multiple allowed): Refines the data based on specific criteria. Each clause consists of:
  - filterKey: Identifies the aspect to filter (e.g., account, date, structure).
  - operator: 
  - value: Provides the details to compare against. Allowed values differ for each filterKey.
- excludeClause (optional, multiple allowed): Excludes data based on specific criteria. Each clause consists of:
  - keyword: `exclude`
  - excludeKey: Identifies the aspect to exclude (e.g., account, date, description).
  - operator:
  - value: Provides the details to compare against. Allowed values differ for each excludeKey.


#### Valid filters for balance query:

| Filter Key | Operator      | Value                                    |
|------------|---------------|------------------------------------------|
| account*    |               | Regex of account name ex: Expense:Food.* |
| date       | last, current | day, week, month, year                   |
| date       | range | 2024-01-01,2024-01-31 (date separated by comma)  |
| structure  |               | flat, nested                             |
| hide       |               | creationDate, path                       |


#### Valid filters for transaction query:

| Filter Key | Operator      | Value                                    |
|------------|---------------|------------------------------------------|
| account    |               | Regex of account name ex: Expense:Food.* |
| date       | last, current | day, week, month, year                   |
| date       | range | 2024-01-01,2024-01-31 (date separated by comma)  |
| structure  |               | flat, nested                             |
| limit      | first, last   | \<number\>                                 |
| order      | asc, desc     | amount, date                             |
| hide       |               | total                                    |

#### Valid excludes for transaction query:

| Exclude Key | Operator      | Value                                    |
|-------------|---------------|------------------------------------------|
| account    |               | Regex of account name ex: Expense:Food.* |
| date       | last, current | day, week, month, year                   |
| date       | range | 2024-01-01,2024-01-31 (date separated by comma)  |
| description    |               | Regex of description ex: .\*salary.\* |


> [!NOTE]
> Required keys are marked with *

> [!TIP]
> Check developer console for any errors. `View > Toggle Developer Tools`

### Examples

````
```oet
balance
account *
structure flat
```
````
This gives balance for all the root level accounts in a flat structure

````
```oet
balance
account Expenses.Food.*
date current month
structure nested
```
````
This gives balance for all the sub-accounts of Expenses:Food in a nested structure


````
```oet
transaction
date current month
structure nested
order asc date
order desc amount
limit last 5
exclude description .*salary.*
```
````
This gives the last 5 transactions in a nested structure, sorted by date in ascending order and amount in the descending order excluding all transactions with salary in them.

> [!NOTE]
> Exclude clause should be added after all the filter clauses
