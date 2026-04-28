// console.log(" I ");

// console.log(" eat ");

// console.log(" Ice Cream ");

// console.log("serving cutomer 1");

// // This will be shown after 2 seconds

// setTimeout(()=>{
//   console.log("serving cutomer 2");
// },2000);  //this is await. 

// console.log("serving cutomer 3")

let stocks = {
    Fruits : ["strawberry", "grapes", "banana", "apple"],
    liquid : ["water", "ice"],
    holder : ["cone", "cup", "stick"],
    toppings : ["chocolate", "peanuts"],
 };

 let order = (call_production) =>{
console.log("Order placed. Please call production")
// function 👇 is being called 
  call_production();
};
let production = () =>{
console.log("Production has started")
};

order(production)