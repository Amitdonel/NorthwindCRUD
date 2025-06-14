USE [Northwind]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[AddProduct]
    @ProductName VARCHAR(50),
    @SupplierID INT,
    @CategoryID INT,
    @Unit VARCHAR(50),
    @Price NUMERIC
AS
BEGIN
    INSERT INTO Products (ProductName, SupplierID, CategoryID, Unit, Price)
    VALUES (@ProductName, @SupplierID, @CategoryID, @Unit, @Price)
END
GO

CREATE PROCEDURE [dbo].[DeleteProduct]
    @ProductID INT
AS
BEGIN
    DELETE FROM Products
    WHERE ProductID = @ProductID
END
GO

CREATE PROCEDURE [dbo].[GetAllProducts]
AS
BEGIN
    SELECT 
        p.ProductID,
        p.ProductName,
        p.Unit,
        p.Price,
        c.CategoryName,
        s.SupplierName
    FROM Products p
    LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
    LEFT JOIN Suppliers s ON p.SupplierID = s.SupplierID
END
GO

CREATE PROCEDURE [dbo].[GetCustomerOrderCounts]
AS
BEGIN
    SELECT 
        c.CustomerName,
        COUNT(o.OrderID) AS OrderCount
    FROM Customers c
    LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
    GROUP BY c.CustomerName
    ORDER BY OrderCount DESC
END
GO

CREATE PROCEDURE [dbo].[GetProductById]
    @ProductID INT
AS
BEGIN
    SELECT 
        p.ProductID,
        p.ProductName,
        p.Unit,
        p.Price,
        c.CategoryName,
        s.SupplierName
    FROM Products p
    JOIN Categories c ON p.CategoryID = c.CategoryID
    JOIN Suppliers s ON p.SupplierID = s.SupplierID
    WHERE p.ProductID = @ProductID
END
GO

CREATE PROCEDURE [dbo].[GetTopCustomers]
AS
BEGIN
    SELECT TOP 3 
        Customers.CustomerName AS customerName,
        COUNT(Orders.OrderID) AS orderCount
    FROM Customers
    JOIN Orders ON Customers.CustomerID = Orders.CustomerID
    GROUP BY Customers.CustomerName
    ORDER BY orderCount DESC
END
GO

CREATE PROCEDURE [dbo].[SearchProducts]
    @keyword NVARCHAR(100)
AS
BEGIN
    SELECT 
        p.ProductID,
        p.ProductName,
        p.Unit,
        p.Price,
        c.CategoryName,
        s.SupplierName
    FROM Products p
    LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
    LEFT JOIN Suppliers s ON p.SupplierID = s.SupplierID
    WHERE p.ProductName LIKE '%' + @keyword + '%' OR c.CategoryName LIKE '%' + @keyword + '%'
END
GO

CREATE PROCEDURE [dbo].[UpdateProduct]
    @ProductID INT,
    @ProductName VARCHAR(50),
    @SupplierID INT,
    @CategoryID INT,
    @Unit VARCHAR(25),
    @Price NUMERIC
AS
BEGIN
    UPDATE Products
    SET 
        ProductName = @ProductName,
        SupplierID = @SupplierID,
        CategoryID = @CategoryID,
        Unit = @Unit,
        Price = @Price
    WHERE ProductID = @ProductID
END
GO

CREATE PROCEDURE [dbo].[UpdateProductPrice]
    @ProductID INT,
    @NewPrice NUMERIC
AS
BEGIN
    UPDATE Products
    SET Price = @NewPrice
    WHERE ProductID = @ProductID
END
GO
