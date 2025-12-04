# Roomy Backend - Unit Tests Documentation

## Test Suite Overview

This project includes **45 comprehensive unit tests** covering the core functionality of the Roomy backend application.

### Test Distribution

1. **CalculatorService Tests (10 tests)** - Tests 1-10
2. **UserController Tests (6 tests)** - Tests 11-16  
3. **ApartmentController Tests (2 tests)** - Tests 17-18
4. **ChoreController Tests (5 tests)** - Tests 19-23
5. **GroceryController Tests (4 tests)** - Tests 24-27
6. **ResidenceController Tests (4 tests)** - Tests 28-31
7. **Model Tests (2 tests)** - Tests 32-33
8. **ApartmentRepository Tests (4 tests)** - Tests 34-37
9. **Integration Tests (7 tests)** - Tests 38-44
10. **Application Context Test (1 test)** - Context Load Test

---

## Test Details

### CalculatorService Tests (src/test/java/com/roomy/service/CalculatorServiceTest.java)

**Test 1: Addition**
- Verifies that multiple numbers are added correctly
- Input: [10.0, 20.0, 30.0]
- Expected: 60.0

**Test 2: Subtraction**
- Verifies sequential subtraction of numbers
- Input: [100.0, 30.0, 20.0]
- Expected: 50.0

**Test 3: Multiplication**
- Verifies multiplication of multiple numbers
- Input: [5.0, 4.0, 2.0]
- Expected: 40.0

**Test 4: Division**
- Verifies sequential division of numbers
- Input: [100.0, 5.0, 2.0]
- Expected: 10.0

**Test 5: Exponent**
- Verifies power calculation
- Input: [2.0, 3.0]
- Expected: 8.0

**Test 6: Division by Zero**
- Verifies that division by zero throws ArithmeticException
- Input: [10.0, 0.0]
- Expected: ArithmeticException thrown

**Test 7: Empty List**
- Verifies that empty number list throws IllegalArgumentException
- Input: []
- Expected: IllegalArgumentException thrown

**Test 8: Unknown Operation**
- Verifies that invalid operation throws IllegalArgumentException
- Input: operation="modulus"
- Expected: IllegalArgumentException thrown

**Test 9: Single Number Addition**
- Verifies that adding a single number returns the number itself
- Input: [42.0]
- Expected: 42.0

**Test 10: Negative Numbers**
- Verifies correct handling of negative values
- Input: [-10.0, -20.0]
- Expected: -30.0

---

### UserController Tests (src/test/java/com/roomy/controller/UserControllerTest.java)

**Test 11: Get All Users**
- Verifies retrieval of all users from database
- Uses Mockito to mock UserRepository
- Expected: List of 2 users returned

**Test 12: Signup**
- Verifies user registration creates new user
- Verifies password is removed from response for security
- Expected: User created with password=null in response

**Test 13: Login Success**
- Verifies successful authentication with valid credentials
- Expected: User object returned with password cleared

**Test 14: Login Failure**
- Verifies failed authentication returns null
- Input: Invalid password
- Expected: null returned

**Test 15: Update Status**
- Verifies user status update functionality
- Input: status="BUSY", customStatus="Working on project"
- Expected: Repository updateStatus method called once

**Test 16: Update Profile**
- Verifies full user profile update
- Expected: Repository updateUser method called once

---

### ApartmentController Tests (src/test/java/com/roomy/controller/ApartmentControllerTest.java)

**Test 17: Create Apartment**
- Verifies apartment creation returns apartment ID
- Uses Mockito to mock ApartmentRepository
- Expected: Apartment ID = 1 returned

**Test 18: Get All Apartments**
- Verifies retrieval of all apartments
- Expected: List of 2 apartments with correct details

---

### ChoreController Tests (src/test/java/com/roomy/controller/ChoreControllerTest.java)

**Test 19: Add Chore**
- Verifies chore creation functionality
- Expected: Repository addChore method called once

**Test 20: Get Chores by Apartment**
- Verifies retrieval of chores for a specific apartment
- Expected: List of 2 chores returned

**Test 21: Update Chore**
- Verifies chore update functionality
- Expected: ChoreId set correctly, updateChore called once

**Test 22: Complete Chore**
- Verifies marking chore as complete
- Expected: markChoreComplete called once

**Test 23: Delete Chore**
- Verifies chore deletion
- Expected: deleteChore called once

---

### GroceryController Tests (src/test/java/com/roomy/controller/GroceryControllerTest.java)

**Test 24: Add Grocery**
- Verifies grocery item creation
- Expected: Repository addGrocery method called once

**Test 25: Get Groceries by Apartment**
- Verifies retrieval of groceries for apartment
- Expected: List of 2 grocery items returned

**Test 26: Mark Grocery as Purchased**
- Verifies purchase status update
- Expected: markAsPurchased called once

**Test 27: Delete Grocery**
- Verifies grocery item deletion
- Expected: deleteGrocery called once

---

### ResidenceController Tests (src/test/java/com/roomy/controller/ResidenceControllerTest.java)

**Test 28: Join Apartment**
- Verifies linking user to apartment
- Expected: addResidence called with correct user and apartment IDs

**Test 29: Get Residents by Apartment**
- Verifies retrieval of apartment residents
- Expected: List of 2 residents returned

**Test 30: Get User Apartment**
- Verifies getting apartment ID for a user
- Expected: Apartment ID returned

**Test 31: Leave Apartment**
- Verifies unlinking user from apartment
- Expected: removeResidence called once

---

### Model Tests (src/test/java/com/roomy/model/ModelTest.java)

**Test 32: User Model**
- Verifies all User model getters and setters
- Tests: userId, username, password, firstName, lastName, email, status, customStatus, bio
- Expected: All properties set and retrieved correctly

**Test 33: Apartment Model**
- Verifies all Apartment model getters and setters
- Tests: apartmentId, complexName, roomNumber, rentAmount, rentDueDay, paymentType, createdBy
- Expected: All properties set and retrieved correctly

---

### ApartmentRepository Tests (src/test/java/com/roomy/repository/ApartmentRepositoryTest.java)

**Test 34: Add Apartment**
- Verifies apartment insertion into database
- Uses mocked JdbcTemplate
- Expected: Apartment ID returned

**Test 35: Get All Apartments**
- Verifies retrieval of all apartments
- Expected: List with 1 apartment returned

**Test 36: Get Apartment by ID**
- Verifies retrieval of specific apartment
- Expected: Apartment with correct complex name returned

**Test 37: Update Apartment**
- Verifies apartment update operation
- Expected: JdbcTemplate update called with correct parameters

---

### Integration Tests (src/test/java/com/roomy/integration/IntegrationTest.java)

**Test 38: Application Context**
- Verifies Spring application context loads successfully
- Expected: Context not null, bean count > 0

**Test 39: User Controller Bean**
- Verifies UserController bean is registered
- Expected: Bean exists in context

**Test 40: Apartment Controller Bean**
- Verifies ApartmentController bean is registered
- Expected: Bean exists in context

**Test 41: Chore Controller Bean**
- Verifies ChoreController bean is registered
- Expected: Bean exists in context

**Test 42: Grocery Controller Bean**
- Verifies GroceryController bean is registered
- Expected: Bean exists in context

**Test 43: Calculator Service Bean**
- Verifies CalculatorService bean is registered
- Expected: Bean exists in context

**Test 44: User Repository Bean**
- Verifies UserRepository bean is registered
- Expected: Bean exists in context

---

## Running Tests

### Via Start Script (Recommended)
```bash
# Windows
start.bat
# Then select option 8

# The script will:
# - Navigate to backend directory
# - Run all 45 tests
# - Display results with success/failure summary
```

### Run All Tests
```bash
cd RoomyFinal-Backend/RoomyFinal-Backend
mvnw test
```

### Run Specific Test Class
```bash
mvnw test -Dtest=CalculatorServiceTest
mvnw test -Dtest=UserControllerTest
mvnw test -Dtest=ApartmentControllerTest
mvnw test -Dtest=ChoreControllerTest
mvnw test -Dtest=GroceryControllerTest
mvnw test -Dtest=ResidenceControllerTest
mvnw test -Dtest=ModelTest
mvnw test -Dtest=ApartmentRepositoryTest
mvnw test -Dtest=IntegrationTest
```

### Run Single Test Method
```bash
mvnw test -Dtest=CalculatorServiceTest#testAddition
mvnw test -Dtest=UserControllerTest#testLoginSuccess
```

### Run Tests with Verbose Output
```bash
mvnw test -X
```

### Skip Tests During Build
```bash
mvnw clean package -DskipTests
```

---

## Test Dependencies

The tests use the following frameworks (included in spring-boot-starter-test):

- **JUnit 5 (Jupiter)**: Test framework
- **Mockito**: Mocking framework for unit tests
## Test Coverage

### Service Layer
- CalculatorService: **100% coverage**
  - All 5 operations tested (add, subtract, multiply, divide, exponent)
  - Edge cases covered (empty list, division by zero, unknown operation)
  - Single value and negative number scenarios

### Controller Layer
- UserController: **Core functionality covered**
  - User retrieval, creation, authentication
  - Status updates and profile management
  - Error handling for invalid credentials

- ApartmentController: **Basic CRUD operations covered**
  - Apartment creation and retrieval
  - List operations with multiple records

- ChoreController: **Full CRUD coverage**
  - Create, read, update, delete operations
  - Mark chore as complete functionality

- GroceryController: **Full CRUD coverage**
  - Create, read, delete operations
  - Purchase status tracking

- ResidenceController: **Full coverage**
  - Join/leave apartment functionality
  - Resident listing and user apartment lookup

### Model Layer
- User Model: **100% coverage**
  - All properties validated
  
- Apartment Model: **100% coverage**
  - All properties validated

### Repository Layer
## Future Test Expansion Opportunities

To achieve higher coverage, consider adding:

- **More Repository Tests**: ChoreRepository, GroceryRepository, ResidenceRepository tests
- **REST API Integration Tests**: Test full request/response cycle with MockMvc
- **PaymentQueueController Tests**: Verify payment rotation logic
- **Security Tests**: Verify CORS and authentication mechanisms
- **Performance Tests**: Load testing for high-traffic scenarios
- **Database Tests**: Use @DataJdbcTest for real database layer testing
- ApartmentController: **Basic CRUD operations covered**
  - Apartment creation and retrieval
  - List operations with multiple records

---

## Best Practices Demonstrated

1. **Descriptive Test Names**: Each test has a clear @DisplayName annotation
2. **Arrange-Act-Assert Pattern**: Tests follow AAA structure
3. **Mocking**: Controllers use Mockito to isolate business logic
4. **Edge Case Testing**: Tests include error scenarios and boundary conditions
5. **Assertions**: Comprehensive assertions with meaningful messages
6. **Setup Methods**: @BeforeEach used for test initialization
7. **Test Isolation**: Each test is independent and can run in any order

---

## Future Test Expansion Opportunities

To achieve higher coverage, consider adding:

- **Integration Tests**: Test full request/response cycle with TestRestTemplate
Expected output when running all tests:

```
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.roomy.controller.ApartmentControllerTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.controller.ChoreControllerTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.controller.GroceryControllerTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.controller.ResidenceControllerTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.controller.UserControllerTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.integration.IntegrationTest
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.model.ModelTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.repository.ApartmentRepositoryTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.RoomyBackendApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.service.CalculatorServiceTest
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 45, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] BUILD SUCCESS
``` Mock Object Errors
- Ensure MockitoAnnotations.openMocks(this) is called in @BeforeEach
- Verify @Mock and @InjectMocks annotations are correct

---

## Test Execution Output

Expected output when running all tests:

```
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.roomy.RoomyBackendApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.service.CalculatorServiceTest
[INFO] Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.controller.UserControllerTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.roomy.controller.ApartmentControllerTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 19, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] BUILD SUCCESS
```

---

---

**Last Updated**: December 3, 2025
**Test Count**: 45 total tests (33 new + 12 original)
**Coverage**: Service, Controller, Model, Repository, and Integration layers
2. Include @DisplayName with descriptive text
3. Use @BeforeEach for setup when needed
4. Add test documentation to this file
5. Ensure tests are independent and repeatable
6. Run full test suite before committing: `mvnw test`

---

**Last Updated**: December 3, 2025
**Test Count**: 18 unit tests + 1 context test = 19 total tests
**Coverage**: Service layer, Controller layer (User & Apartment)
