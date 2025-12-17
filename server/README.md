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
- [Query Operators Reference](#query-operators-reference)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Express Routes Cheat Sheet](#express-routes-cheat-sheet)
  - [URL Parameters](#url-parameters-reqparams)
  - [Query Strings](#query-strings-reqquery)
  - [Request Body](#request-body-reqbody)
  - [Request Headers](#request-headers-reqheaders)
  - [Complete Route Examples](#complete-route-examples)
  - [Route Parameters Summary](#route-parameters-summary)
- [Mongoose Model Schema Cheat Sheet](#mongoose-model-schema-cheat-sheet)
  - [Basic Schema Structure](#basic-schema-structure)
  - [Data Types](#data-types)
  - [Validation Options](#validation-options)
  - [Schema Options](#schema-options)
  - [Indexes](#indexes)
  - [Virtual Properties](#virtual-properties)
  - [Instance Methods](#instance-methods)
  - [Static Methods](#static-methods)
  - [Middleware (Hooks)](#middleware-hooks)
  - [Complete Schema Example](#complete-schema-example)
  - [Schema Data Types Summary](#schema-data-types-summary)

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

## Express Routes Cheat Sheet

This section covers how to handle different types of data in Express routes: URL parameters, query strings, and request bodies.

### URL Parameters (req.params)
Data embedded in the URL path.

**Route Definition:**
```javascript
router.get('/users/:id', getUserById);
router.get('/users/:userId/posts/:postId', getPostByUser);
```

**Accessing Parameters:**
```javascript
const getUserById = async (req, res) => {
  const userId = req.params.id;
  // URL: /users/123 → userId = "123"
  
  const user = await User.findById(userId);
  res.json({ success: true, data: user });
};

const getPostByUser = async (req, res) => {
  const { userId, postId } = req.params;
  // URL: /users/123/posts/456 → userId = "123", postId = "456"
  
  res.json({ userId, postId });
};
```

**When to use:**
- Required data that identifies a resource
- RESTful API design (e.g., `/users/:id`, `/posts/:postId`)

---

### Query Strings (req.query)
Data passed in the URL after `?` (optional parameters).

**URL Examples:**
```
/users?page=2&limit=10
/users?search=john&gender=male&minAge=18
/products?category=electronics&sort=price&order=asc
```

**Accessing Query Parameters:**
```javascript
const getAllUsers = async (req, res) => {
  // Extract query parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search;
  const gender = req.query.gender;
  
  // Build filter object
  const filter = {};
  if (search) filter.name = new RegExp(search, 'i'); // Case-insensitive search
  if (gender) filter.gender = gender;
  
  // Execute query
  const users = await User.find(filter)
    .limit(limit)
    .skip((page - 1) * limit);
  
  res.json({ success: true, data: users });
};
```

**Common Patterns:**

**Pagination:**
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const users = await User.find().skip(skip).limit(limit);
```

**Sorting:**
```javascript
const sortBy = req.query.sortBy || 'createdAt';
const order = req.query.order === 'asc' ? 1 : -1;

const users = await User.find().sort({ [sortBy]: order });
```

**Filtering:**
```javascript
const { gender, minAge, maxAge, status } = req.query;

const filter = {};
if (gender) filter.gender = gender;
if (status) filter.status = status;
if (minAge || maxAge) {
  filter.age = {};
  if (minAge) filter.age.$gte = parseInt(minAge);
  if (maxAge) filter.age.$lte = parseInt(maxAge);
}

const users = await User.find(filter);
```

**Search:**
```javascript
const search = req.query.search;

const filter = search 
  ? { $or: [
      { firstName: new RegExp(search, 'i') },
      { lastName: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ]}
  : {};

const users = await User.find(filter);
```

**When to use:**
- Optional parameters
- Filtering, sorting, pagination
- Search queries

---

### Request Body (req.body)
Data sent in the HTTP request body (POST, PUT, PATCH).

**Accessing Body Data:**
```javascript
const createUser = async (req, res) => {
  // Extract entire body
  const userData = req.body;
  
  // Or extract specific fields
  const { firstName, lastName, email, age } = req.body;
  
  const user = await User.create(userData);
  res.status(201).json({ success: true, data: user });
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;
  
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  res.json({ success: true, data: user });
};
```

**Client sends (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "age": 25
}
```

**When to use:**
- Creating resources (POST)
- Updating resources (PUT, PATCH)
- Complex data structures

---

### Request Headers (req.headers)
Metadata about the request.

**Accessing Headers:**
```javascript
const getProfile = async (req, res) => {
  // Get authorization token
  const token = req.headers.authorization?.split(' ')[1];
  
  // Get content type
  const contentType = req.headers['content-type'];
  
  // Custom headers
  const apiKey = req.headers['x-api-key'];
  
  res.json({ token, contentType, apiKey });
};
```

**Common Headers:**
- `authorization` - Authentication tokens
- `content-type` - Data format (application/json)
- `accept` - Expected response format
- `user-agent` - Client information

---

### Complete Route Examples

**GET with Query Parameters:**
```javascript
// Route: GET /api/users?page=1&limit=10&gender=male&search=john
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, gender, search } = req.query;
    
    const filter = {};
    if (gender) filter.gender = gender;
    if (search) filter.name = new RegExp(search, 'i');
    
    const users = await User.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await User.countDocuments(filter);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**GET with URL Parameter:**
```javascript
// Route: GET /api/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**POST with Request Body:**
```javascript
// Route: POST /api/users
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

**PUT with URL Parameter and Body:**
```javascript
// Route: PUT /api/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

**DELETE with URL Parameter:**
```javascript
// Route: DELETE /api/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

### Route Parameters Summary

| Type          | Location         | Access Method  | Use Case                           |
|---------------|------------------|----------------|------------------------------------|
| URL Params    | URL path         | `req.params`   | Resource identification            |
| Query String  | URL after `?`    | `req.query`    | Optional filters, pagination       |
| Request Body  | HTTP body        | `req.body`     | Creating/updating resources        |
| Headers       | HTTP headers     | `req.headers`  | Authentication, metadata           |

---

## Mongoose Model Schema Cheat Sheet

This section covers how to define Mongoose schemas with various data types, validations, and options.

### Basic Schema Structure

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Field definitions go here
  },
  {
    // Schema options go here
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
```

---

### Data Types

**String:**
```javascript
name: {
  type: String,
  required: true,
  trim: true,
  lowercase: true, // Convert to lowercase
  uppercase: true, // Convert to uppercase
  minlength: 2,
  maxlength: 50,
  match: /^[A-Za-z]+$/, // Regex validation
  enum: ['active', 'inactive'], // Only allow these values
  default: 'active'
}
```

**Number:**
```javascript
age: {
  type: Number,
  required: true,
  min: 0,
  max: 120,
  default: 18
}
```

**Boolean:**
```javascript
isActive: {
  type: Boolean,
  default: true
}
```

**Date:**
```javascript
birthDate: {
  type: Date,
  required: true,
  default: Date.now
}
```

**Array of Strings:**
```javascript
tags: {
  type: [String],
  default: []
}
```

**Array of Numbers:**
```javascript
scores: {
  type: [Number],
  validate: {
    validator: function(arr) {
      return arr.length <= 10;
    },
    message: 'Cannot have more than 10 scores'
  }
}
```

**Array of Objects:**
```javascript
addresses: [{
  street: String,
  city: String,
  zipCode: String,
  isDefault: { type: Boolean, default: false }
}]
```

**Nested Object:**
```javascript
profile: {
  bio: String,
  avatar: String,
  social: {
    twitter: String,
    linkedin: String
  }
}
```

**ObjectId (Reference):**
```javascript
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
```

**Mixed (Any Type):**
```javascript
metadata: {
  type: mongoose.Schema.Types.Mixed
}
```

**Buffer (Binary Data):**
```javascript
image: {
  type: Buffer
}
```

---

### Validation Options

**Required:**
```javascript
email: {
  type: String,
  required: true,
  required: [true, 'Email is required'] // Custom error message
}
```

**Unique:**
```javascript
email: {
  type: String,
  unique: true
}
```

**Enum (Specific Values Only):**
```javascript
role: {
  type: String,
  enum: ['user', 'admin', 'moderator'],
  enum: {
    values: ['user', 'admin', 'moderator'],
    message: '{VALUE} is not a valid role'
  }
}
```

**Min/Max Length:**
```javascript
username: {
  type: String,
  minlength: [3, 'Username must be at least 3 characters'],
  maxlength: [20, 'Username cannot exceed 20 characters']
}
```

**Min/Max (Numbers):**
```javascript
age: {
  type: Number,
  min: [0, 'Age cannot be negative'],
  max: [120, 'Age cannot exceed 120']
}
```

**Match (Regex):**
```javascript
email: {
  type: String,
  match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Please enter a valid email']
}
```

**Custom Validation:**
```javascript
age: {
  type: Number,
  validate: {
    validator: function(value) {
      return value >= 18;
    },
    message: 'Must be 18 or older'
  }
}
```

**Async Validation:**
```javascript
email: {
  type: String,
  validate: {
    validator: async function(value) {
      const user = await mongoose.models.User.findOne({ email: value });
      return !user;
    },
    message: 'Email already exists'
  }
}
```

---

### Schema Options

**Timestamps:**
```javascript
const userSchema = new mongoose.Schema({
  name: String
}, {
  timestamps: true // Adds createdAt and updatedAt
});
```

**Custom Timestamp Field Names:**
```javascript
const userSchema = new mongoose.Schema({
  name: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
```

**Disable _id:**
```javascript
const subSchema = new mongoose.Schema({
  field: String
}, {
  _id: false
});
```

**toJSON Options:**
```javascript
const userSchema = new mongoose.Schema({
  name: String,
  password: String
}, {
  toJSON: {
    virtuals: true, // Include virtual properties
    transform: function(doc, ret) {
      delete ret.password; // Remove password from JSON
      return ret;
    }
  }
});
```

---

### Indexes

**Single Field Index:**
```javascript
userSchema.index({ email: 1 }); // Ascending
userSchema.index({ age: -1 }); // Descending
```

**Compound Index:**
```javascript
userSchema.index({ firstName: 1, lastName: 1 });
```

**Unique Index:**
```javascript
userSchema.index({ email: 1 }, { unique: true });
```

**Text Index (for search):**
```javascript
userSchema.index({ name: 'text', bio: 'text' });
```

---

### Virtual Properties

**Computed Fields (not stored in DB):**
```javascript
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Usage:
const user = await User.findById(id);
console.log(user.fullName); // "John Doe"
```

**Virtual with Setter:**
```javascript
userSchema.virtual('fullName')
  .get(function() {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function(value) {
    const parts = value.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  });
```

---

### Instance Methods

**Methods available on individual documents:**
```javascript
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email
  };
};

// Usage:
const user = await User.findById(id);
const profile = user.getPublicProfile();
```

**Async Instance Method:**
```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

---

### Static Methods

**Methods available on the Model:**
```javascript
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Usage:
const user = await User.findByEmail('john@example.com');
```

**Static with Parameters:**
```javascript
userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

userSchema.statics.findByAgeRange = function(min, max) {
  return this.find({ age: { $gte: min, $lte: max } });
};
```

---

### Middleware (Hooks)

**Pre Save:**
```javascript
// Runs before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

**Post Save:**
```javascript
// Runs after saving
userSchema.post('save', function(doc) {
  console.log(`User ${doc.name} was saved`);
});
```

**Pre Remove:**
```javascript
userSchema.pre('remove', async function(next) {
  // Delete user's posts when user is deleted
  await Post.deleteMany({ author: this._id });
  next();
});
```

**Pre Find:**
```javascript
// Runs before any find query
userSchema.pre('find', function() {
  this.where({ isDeleted: false }); // Auto-filter deleted users
});
```

---

### Complete Schema Example

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Please enter valid email']
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // Don't include in queries by default
    },
    
    // Profile
    age: {
      type: Number,
      min: 0,
      max: 120
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    bio: {
      type: String,
      maxlength: 500
    },
    
    // Arrays
    tags: [String],
    skills: [{
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
      }
    }],
    
    // References
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    // Status
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ firstName: 'text', lastName: 'text' });

// Virtual
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Instance Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.fullName,
    email: this.email,
    role: this.role
  };
};

// Static Methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).select('+password');
};

userSchema.statics.findActive = function() {
  return this.find({ isActive: true, isDeleted: false });
};

// Middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.pre('find', function() {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model('User', userSchema);
```

---

### Schema Data Types Summary

| Type          | Mongoose Type                     | Use Case                           |
|---------------|-----------------------------------|------------------------------------|
| String        | `String`                          | Text data                          |
| Number        | `Number`                          | Integers, decimals                 |
| Boolean       | `Boolean`                         | True/false values                  |
| Date          | `Date`                            | Timestamps, dates                  |
| Array         | `[Type]`                          | Lists of items                     |
| Object        | `{}`                              | Nested data structures             |
| ObjectId      | `mongoose.Schema.Types.ObjectId`  | References to other documents      |
| Mixed         | `mongoose.Schema.Types.Mixed`     | Any type of data                   |
| Buffer        | `Buffer`                          | Binary data (images, files)        |
| Decimal128    | `mongoose.Schema.Types.Decimal128`| High precision numbers             |
| Map           | `Map`                             | Key-value pairs                    |

---