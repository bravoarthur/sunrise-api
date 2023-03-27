# sunrise-api
	The project is meant to make easy to the Chef guarantee that the products ordered were delivered by the Suppliers. The Chef has a admin login (using JWT) and has specific pages to insert new products, suppliers and categories. Once the Chef insert a new Order, it will be visible when the hosts users access the initial page, but the list has no quantities. When the supplier delivers the order, the employee who receive the order have to insert the quantities received. If the quantities don’t match with the Original Order list, it shows a warning. The checker may check the products again or do a note and confirm it has received with missing items. If the order is correct the Order is closed, in other hand if the order has inconsistences, it will be showed to the chef at front page to confer and be aware of the missing Items. 

## Backend developed using NodeJS with Typescript
## MongoDB was used as Data Base 
