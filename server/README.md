# Mongoose Controller Cheat Sheet

This comprehensive cheat sheet provides common Mongoose operations in controller format, with detailed explanations for each. Use these patterns to handle CRUD and query logic in your Express backend.

---

## Table of Contents
- [Create Operations](#create-operations)
- [Read Operations](#read-operations)
- [Update Operations](#update-operations)
- [Delete Operations](#delete-operations)
- [Query Operations](#query-operations)
- [Advanced Operations](#advanced-operations)
- [Summary Table](#summary-table)

---

## Create Operations

### Create (Insert One)
Adds a new document to the collection using data from the request body.

**Usage:**
```javascript
const user = await User.create(req.body);
```

**What it does:**
- Validates data against the schema
- Inserts a new document into the database
- Returns the created document with its `_id`

**Example in Controller:**
```javascript
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
```

### Insert Many
Inserts multiple documents at once.

**Usage:**
```javascript
const users = await User.insertMany([
  { name: "John", email: "john@example.com" },
  { name: "Jane", email: "jane@example.com" }
]);
```

**What it does:**
- Bulk insert operation (faster than multiple `create` calls)
- Returns an array of created documents
- Stops on first error by default (can be configured)

---

## Read Operations

### Find All (Get All)
Retrieves all documents from the collection.

**Usage:**
```javascript
const users = await User.find();
```

**What it does:**
- Returns an array of all documents
- Returns empty array `[]` if no documents exist
- Can be chained with sort, limit, skip, etc.

**Example in Controller:**
```javascript
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Find One by ID
Finds a single document by its unique MongoDB `_id`.

**Usage:**
```javascript
const user = await User.findById(req.params.id);
```

**What it does:**
- Searches by `_id` field
- Returns the document or `null` if not found
- Automatically converts string ID to ObjectId

**Example in Controller:**
```javascript
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Find One by Field
Finds a single document matching a specific field (e.g., email).

**Usage:**
```javascript
const user = await User.findOne({ email: req.body.email });
```

**What it does:**
- Returns the first matching document
- Returns `null` if no match found
- Can match multiple fields: `{ firstName: "John", lastName: "Doe" }`

**Example:**
```javascript
// Find by email
const user = await User.findOne({ email: "john@example.com" });

// Find by multiple fields
const user = await User.findOne({ firstName: "John", age: 25 });
```

### Find with Multiple Conditions
Finds documents matching multiple criteria.

**Usage:**
```javascript
const users = await User.find({ 
  age: { $gte: 18 }, 
  gender: "male" 
});
```

**Common Query Operators:**
- `$eq` - Equal to
- `$ne` - Not equal to
- `$gt` - Greater than
- `$gte` - Greater than or equal to
- `$lt` - Less than
- `$lte` - Less than or equal to
- `$in` - Matches any value in array
- `$nin` - Matches none of the values in array

**Examples:**
```javascript
// Age between 18 and 30
const users = await User.find({ age: { $gte: 18, $lte: 30 } });

// Gender is male OR female
const users = await User.find({ gender: { $in: ['male', 'female'] } });

// Not equal to
const users = await User.find({ status: { $ne: 'inactive' } });
```

### Exists Check
Checks if a document exists without retrieving it.

**Usage:**
```javascript
const exists = await User.exists({ email: req.body.email });
```

**What it does:**
- Returns `{ _id: ObjectId }` if document exists
- Returns `null` if document doesn't exist
- More efficient than `findOne` when you only need to check existence

---

## Update Operations

### Update by ID
Updates a document by its `_id` with new data from the request body.

**Usage:**
```javascript
const user = await User.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new: true, runValidators: true }
);
```

**Options:**
- `{ new: true }` - Returns the updated document (default: returns old document)
- `{ runValidators: true }` - Runs schema validation on update
- `{ upsert: true }` - Creates document if it doesn't exist

**Example in Controller:**
```javascript
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
```

### Update One by Field
Updates a single document matching specific criteria.

**Usage:**
```javascript
const user = await User.findOneAndUpdate(
  { email: req.body.email },
  { $set: { age: 30 } },
  { new: true, runValidators: true }
);
```

**Update Operators:**
- `$set` - Set field value
- `$unset` - Remove field
- `$inc` - Increment number
- `$push` - Add to array
- `$pull` - Remove from array

**Examples:**
```javascript
// Increment age by 1
await User.findByIdAndUpdate(id, { $inc: { age: 1 } });

// Add tag to array
await User.findByIdAndUpdate(id, { $push: { tags: "premium" } });

// Remove field
await User.findByIdAndUpdate(id, { $unset: { middleName: "" } });
```

### Update Many
Updates all documents matching the filter.

**Usage:**
```javascript
const result = await User.updateMany(
  { isActive: false },
  { $set: { isActive: true } }
);
```

**What it does:**
- Updates multiple documents at once
- Returns an object with `modifiedCount`, `matchedCount`, etc.
- Does not return the updated documents

**Example:**
```javascript
// Activate all inactive users
const result = await User.updateMany(
  { isActive: false },
  { $set: { isActive: true } }
);
console.log(`Updated ${result.modifiedCount} users`);
```

---

## Delete Operations

### Delete by ID
Deletes a single document by its `_id`.

**Usage:**
```javascript
const user = await User.findByIdAndDelete(req.params.id);
```

**What it does:**
- Deletes document and returns it
- Returns `null` if document not found
- Useful when you need the deleted document data

**Example in Controller:**
```javascript
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Delete One by Field
Deletes a single document matching specific criteria.

**Usage:**
```javascript
const user = await User.findOneAndDelete({ email: req.body.email });
```

**What it does:**
- Deletes first matching document
- Returns the deleted document
- Returns `null` if no match found

### Delete Many
Deletes all documents matching the filter.

**Usage:**
```javascript
const result = await User.deleteMany({ isActive: false });
```

**What it does:**
- Deletes multiple documents at once
- Returns an object with `deletedCount`
- Does not return the deleted documents

**Example:**
```javascript
// Delete all inactive users
const result = await User.deleteMany({ isActive: false });
console.log(`Deleted ${result.deletedCount} users`);

// Delete ALL documents (dangerous!)
const result = await User.deleteMany({});
```

---

## Query Operations

### Count Documents
Counts the number of documents matching a filter.

**Usage:**
```javascript
const count = await User.countDocuments({ gender: 'male' });
```

**What it does:**
- Counts documents matching the filter
- Returns a number
- Accurate count (can be slow for large collections)

**Examples:**
```javascript
// Count all users
const totalUsers = await User.countDocuments();

// Count male users
const maleCount = await User.countDocuments({ gender: 'male' });

// Count users over 18
const adultCount = await User.countDocuments({ age: { $gte: 18 } });
```

### Estimated Document Count
Gets an estimated count of all documents (fast, no filter).

**Usage:**
```javascript
const total = await User.estimatedDocumentCount();
```

**What it does:**
- Fast estimate based on collection metadata
- Does NOT accept a filter
- Good for displaying total counts on dashboards

### Sort, Limit, Skip (Pagination)
Retrieves documents with sorting, limiting, and pagination.

**Usage:**
```javascript
const users = await User.find()
  .sort({ age: -1 })
  .limit(10)
  .skip(20);
```

**Sorting:**
- `1` or `'asc'` - Ascending order
- `-1` or `'desc'` - Descending order

**What it does:**
- `sort()` - Orders results by field(s)
- `limit()` - Limits number of results
- `skip()` - Skips first N results (for pagination)

**Pagination Example:**
```javascript
const page = 2; // Current page
const pageSize = 10; // Items per page

const users = await User.find()
  .sort({ createdAt: -1 })
  .limit(pageSize)
  .skip((page - 1) * pageSize);

// Get total count for pagination info
const totalUsers = await User.countDocuments();
const totalPages = Math.ceil(totalUsers / pageSize);
```

### Select Specific Fields
Returns only specific fields from documents.

**Usage:**
```javascript
const users = await User.find().select('firstName lastName email');
```

**What it does:**
- Includes only specified fields
- Use `-fieldName` to exclude fields
- Reduces data transfer and improves performance

**Examples:**
```javascript
// Include only firstName and email
const users = await User.find().select('firstName email');

// Exclude password field
const users = await User.find().select('-password');

// Multiple exclusions
const users = await User.find().select('-password -__v');
```

### Distinct Values
Gets unique values for a specific field.

**Usage:**
```javascript
const uniqueGenders = await User.distinct('gender');
```

**What it does:**
- Returns array of unique values
- Useful for filters, dropdowns, analytics
- Can be combined with a query filter

**Example:**
```javascript
// Get all unique genders
const genders = await User.distinct('gender');
// Returns: ['male', 'female', 'other']

// Get unique ages for male users
const maleAges = await User.distinct('age', { gender: 'male' });
```

### Lean Queries
Returns plain JavaScript objects instead of Mongoose documents.

**Usage:**
```javascript
const users = await User.find().lean();
```

**What it does:**
- Returns plain JS objects (no Mongoose methods)
- Faster and uses less memory
- Good for read-only operations

**When to use:**
- When you don't need to modify/save documents
- For API responses (already serializing to JSON)
- Performance-critical queries

---

## Advanced Operations

### Aggregation Pipeline
Performs complex data processing and analysis.

**Usage:**
```javascript
const stats = await User.aggregate([
  { $group: { _id: "$gender", total: { $sum: 1 } } }
]);
```

**Common Pipeline Stages:**
- `$match` - Filter documents (like `find`)
- `$group` - Group documents and calculate aggregates
- `$sort` - Sort results
- `$project` - Reshape documents
- `$limit` - Limit results
- `$skip` - Skip documents

**Examples:**

**Group by gender and count:**
```javascript
const genderStats = await User.aggregate([
  { $group: { 
      _id: "$gender", 
      count: { $sum: 1 },
      avgAge: { $avg: "$age" }
    } 
  }
]);
// Returns: [{ _id: 'male', count: 150, avgAge: 28.5 }, ...]
```

**Filter, group, and sort:**
```javascript
const ageGroups = await User.aggregate([
  { $match: { isActive: true } },
  { $group: { 
      _id: { $floor: { $divide: ["$age", 10] } },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);
```

**Calculate statistics:**
```javascript
const stats = await User.aggregate([
  { $group: {
      _id: null,
      totalUsers: { $sum: 1 },
      avgAge: { $avg: "$age" },
      minAge: { $min: "$age" },
      maxAge: { $max: "$age" }
    }
  }
]);
```

### Population (References)
Automatically replace document references with actual documents.

**Usage:**
```javascript
const user = await User.findById(id).populate('posts');
```

**Schema Setup:**
```javascript
// User model with reference
const userSchema = new mongoose.Schema({
  name: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});
```

**Examples:**
```javascript
// Populate single reference
const user = await User.findById(id).populate('posts');

// Populate multiple references
const user = await User.findById(id).populate('posts').populate('comments');

// Populate with field selection
const user = await User.findById(id).populate('posts', 'title content');

// Nested population
const user = await User.findById(id).populate({
  path: 'posts',
  populate: { path: 'author' }
});
```

### Transactions
Execute multiple operations atomically (all succeed or all fail).

**Usage:**
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await User.create([{ name: "John" }], { session });
  await Post.create([{ title: "Hello" }], { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

**When to use:**
- When multiple operations must succeed together
- Financial transactions
- Creating related documents

### Text Search
Perform text search on indexed fields.

**Schema Setup:**
```javascript
const userSchema = new mongoose.Schema({
  name: String,
  bio: String
});
userSchema.index({ name: 'text', bio: 'text' });
```

**Usage:**
```javascript
const users = await User.find({ $text: { $search: "john developer" } });
```

---

## Summary Table

| Operation              | Method                      | Purpose                                         | Returns              |
|------------------------|-----------------------------|-------------------------------------------------|----------------------|
| **CREATE**             |                             |                                                 |                      |
| Create one             | `create()`                  | Add a new document                              | Document             |
| Insert many            | `insertMany()`              | Bulk insert multiple documents                  | Array of documents   |
| **READ**               |                             |                                                 |                      |
| Find all               | `find()`                    | Get all documents                               | Array                |
| Find by ID             | `findById()`                | Get one document by `_id`                       | Document or null     |
| Find one               | `findOne()`                 | Get one document by field(s)                    | Document or null     |
| Exists                 | `exists()`                  | Check if document exists                        | Object or null       |
| Count                  | `countDocuments()`          | Count documents matching filter                 | Number               |
| Estimated count        | `estimatedDocumentCount()`  | Fast estimate of total documents                | Number               |
| Distinct               | `distinct()`                | Get unique values for a field                   | Array                |
| **UPDATE**             |                             |                                                 |                      |
| Update by ID           | `findByIdAndUpdate()`       | Update document by `_id`                        | Document or null     |
| Update one             | `findOneAndUpdate()`        | Update first matching document                  | Document or null     |
| Update many            | `updateMany()`              | Update multiple documents                       | Result object        |
| **DELETE**             |                             |                                                 |                      |
| Delete by ID           | `findByIdAndDelete()`       | Delete document by `_id`                        | Document or null     |
| Delete one             | `findOneAndDelete()`        | Delete first matching document                  | Document or null     |
| Delete many            | `deleteMany()`              | Delete multiple documents                       | Result object        |
| **QUERY MODIFIERS**    |                             |                                                 |                      |
| Sort                   | `.sort()`                   | Order results                                   | Query                |
| Limit                  | `.limit()`                  | Limit number of results                         | Query                |
| Skip                   | `.skip()`                   | Skip first N results                            | Query                |
| Select                 | `.select()`                 | Choose which fields to return                   | Query                |
| Lean                   | `.lean()`                   | Return plain JS objects                         | Query                |
| Populate               | `.populate()`               | Replace references with documents               | Query                |
| **ADVANCED**           |                             |                                                 |                      |
| Aggregation            | `aggregate()`               | Complex data processing                         | Array                |
| Text search            | `find({ $text })`           | Full-text search                                | Array                |
| Transactions           | `startSession()`            | Atomic multi-document operations                | Session              |

---

## Query Operators Reference

### Comparison
- `$eq` - Equal to
- `$ne` - Not equal to
- `$gt` - Greater than
- `$gte` - Greater than or equal
- `$lt` - Less than
- `$lte` - Less than or equal
- `$in` - Matches any value in array
- `$nin` - Matches none in array

### Logical
- `$and` - Join conditions with AND
- `$or` - Join conditions with OR
- `$not` - Inverts condition
- `$nor` - Joins conditions with NOR

### Element
- `$exists` - Field exists
- `$type` - Field is of type

### Array
- `$all` - Array contains all elements
- `$elemMatch` - Array element matches condition
- `$size` - Array has specific length

---

## Best Practices

1. **Always use try-catch blocks** in async controllers
2. **Validate input** before database operations
3. **Use indexes** for frequently queried fields
4. **Use `.lean()`** for read-only operations
5. **Use `.select()`** to limit returned fields
6. **Use pagination** for large result sets
7. **Use `{ new: true, runValidators: true }`** in updates
8. **Handle null returns** from find operations
9. **Use transactions** for related operations
10. **Index text fields** for text search

---

## Common Patterns

### Pagination with Total Count
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const [users, total] = await Promise.all([
  User.find().skip(skip).limit(limit),
  User.countDocuments()
]);

res.json({
  success: true,
  data: users,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  }
});
```

### Search with Filters
```javascript
const { search, gender, minAge, maxAge } = req.query;

const filter = {};
if (search) filter.$text = { $search: search };
if (gender) filter.gender = gender;
if (minAge || maxAge) {
  filter.age = {};
  if (minAge) filter.age.$gte = parseInt(minAge);
  if (maxAge) filter.age.$lte = parseInt(maxAge);
}

const users = await User.find(filter);
```

### Soft Delete Pattern
```javascript
// Schema
const userSchema = new mongoose.Schema({
  name: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
});

// Soft delete
const softDelete = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
};

// Find only active users
const activeUsers = await User.find({ isDeleted: false });
```

---

**Tip:**  
Replace `User` with your model name as needed.  
Use `req.body`, `req.params`, or `req.query` for input from the client.

---