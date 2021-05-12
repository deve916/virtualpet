var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

var feed,lastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feedtheDog=createButton("feed");
  feedtheDog.position(600,95);
  feedtheDog.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val()
  });
  //write code to display text lastFed time here
  if(lastFed>=12){ 
    text("Last Feed:"+lastFed%12+"PM",300,30)
   } else if(lastFed==0){ text("Last Feed :12 AM",300,30) 
  } else{ text("Last Feed:"+lastFed+"PM",300,30) }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  var food_Stock = foodObj.getFoodStock();
  if(food_Stock<=0) {
    foodObj.updateFoodStock(food_Stock*0);
  }else{
    foodObj.updateFoodStock(food_Stock-1)
  }
  database.ref('/').update({
    FeedTime:hour(),
  Food : foodObj. getFoodStock()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
