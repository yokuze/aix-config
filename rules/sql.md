---
paths:
  - "**/*.sql"
---

## Core Principles

* Readability and clarity through vertical alignment
* UPPERCASE keywords and functions
* Explicit column names (never `SELECT *`)
* Consistent formatting and indentation

## Formatting Rules

### Indentation and Alignment

* **Vertically align** sibling elements of queries
* **Indent** new lines in statements
* **Start new lines with commas** when splitting comma-delimited text
* **Break lines at keywords** (JOIN, WHERE, AND, OR)
* **Terminate statements** with semicolon on new line

```sql
SELECT u.userID
     , u.firstName
     , u.lastName
     , p.profileImageUrl
  FROM Users u
  JOIN UserProfiles p
    ON u.userID = p.userID
 WHERE u.isActive = 1
   AND u.createdDate >= '2023-01-01'
ORDER BY u.lastName
        , u.firstName
;
```

### Alignment Pattern Quick Reference

```sql
SELECT column1          -- SELECT keyword left-aligned
     , column2          -- Columns aligned with comma-first
     , column3
  FROM TableName t      -- FROM indented 2 spaces
  JOIN OtherTable o     -- JOIN aligned with FROM
    ON t.id = o.id      -- ON conditions indented from JOIN
   AND t.active = 1     -- Additional conditions aligned with ON
 WHERE t.status = 1     -- WHERE aligned with FROM/JOIN
   AND t.date > '2023'  -- Additional conditions aligned
ORDER BY column1        -- ORDER BY aligned with FROM/JOIN/WHERE
        , column2       -- Order columns aligned
;                       -- Semicolon on new line
```

## Naming Conventions

* **UPPERCASE**: SQL keywords, functions (SELECT, FROM, WHERE, COUNT)
* **PascalCase**: Table and view names, plural form (e.g., `Users`, `UserProfiles`)
* **camelCase**: Column names (e.g., `userID`, `firstName`, `emailAddress`)
* **Capitalize "ID"** suffix (e.g., `userID`, not `userId`)
* **Aliases**: Short but clear; one/two letters for simple cases (e.g., `u`, `p`),
  descriptive abbreviations for complex queries

## Query Structure

### SELECT Statements

* List columns in logical order: IDs first, descriptive fields, then dates
* Use explicit column names (never `SELECT *`)
* Group related columns together

### JOIN Clauses

* Use explicit JOIN syntax (INNER JOIN, LEFT JOIN, etc.)
* Align ON conditions with JOIN keyword
* Use parentheses for complex join conditions

### WHERE Clauses

* Each condition on its own line for complex queries
* Use parentheses to clarify order of operations
* Group related conditions together

## Performance Guidelines

### Indexing

* Create indexes for columns in WHERE and JOIN clauses
* Create composite indexes for multi-column queries
* Consider maintenance cost on frequently-updated tables

### Query Optimization

* Use **EXISTS** instead of IN for subqueries checking existence
* Limit result sets with appropriate WHERE conditions
* Use LIMIT when only a subset is needed
* Use `EXPLAIN QUERY PLAN` to verify index usage

## DDL

### Table Creation

* Define primary keys explicitly
* Use appropriate data types
* Include NOT NULL constraints where appropriate
* Add meaningful default values
* Define foreign key relationships explicitly

```sql
CREATE TABLE Users (
   userID INTEGER PRIMARY KEY AUTOINCREMENT
 , firstName TEXT NOT NULL
 , lastName TEXT NOT NULL
 , emailAddress TEXT NOT NULL UNIQUE
 , isActive INTEGER NOT NULL DEFAULT 1
 , createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
 , lastModifiedDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Best Practices

* Use **parameterized queries** to prevent SQL injection
* Avoid dynamic SQL with string concatenation
* Consider NULL values in logic; use COALESCE for defaults
* Keep queries focused on single purpose
* Break complex queries into views or CTEs when appropriate
* SQLite supports both ordinary and recursive CTEs
* Comment complex business logic and non-obvious performance considerations
