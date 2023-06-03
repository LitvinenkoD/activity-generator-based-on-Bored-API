/* 
Hi there! Welcome to the JS part of the project.
This is a pretty big file and so I will do my best
to make it as easy to navigate as possible.



First of all, a couple of words about the project itself.
This website is, in a nutshell, a multi paged form that 
collects user input and then returns output on the last 
page. The idea was to make this look like an app, instead
of like a boring form, but functionally, this is a form
and it is easier to understand this website as a form.

There are 5 pages - The welcome page, 3 middle pages
that collect input, and the last page which is the output
section.

There is navigation between all pages using buttons. You can
not navigate freely, instead you'd use the infrastructure I 
provided with buttons.

All pages except for the last page can visit neibhoring pages,
page one can visit page 5 and page 5 can visit page 1.


All user input is saved to local storage any time user enters
or modifies anything. As soon as you'd click on a category
card for instance, the status of all category cards is 
saved to local storage.

Local storage keeps track of:
* Current page
* Selected Category cards
* Selected People cards
* Selected Cost range
* Last generated API response
* Whether or not last generation was random (bool value)

This allows to make the app as user friendly as possible. 
It is very flexible with usage and it behaves as you would
expect it to behave if it was an actual production website.

I am using Bored API, there is a link to it on the title page
of the site.



Additional things to know:
script.js is a modular file and I'm importing two other js files.
This is done for readability and to separate important things from
less important. script.js file is the "main".

utils.js contains formatter functions that are needed to communicate
with the API. They format user input and interpret output for the
user.

range_selector.js is a class I used to make the cost range selector.
I decided to abstract it to a separate file to, again, save space
and decrese noise in the main file. It contains the class definition
and the definition of some methods that are used on the class.



Structure of script.js - this file:


1. Variable and DOM elems Definition
2. DOM ContentLoaded event
3. Navigation buttons' logic
4. Page navigation manager - handleNavigation
5. User input collectors

6. Url generator (for the API)
7. API request sender and output collector
8. Function that pastes API output into the DOM
9. API output animator


You can go to the respective code group
by using CTRL F




All logical group title comments start
and end with ===,
all local comments are just comments.

Happy reading!

*/


import * as utils from "./utils.js";




// === Variable and DOM elems Definition ===


// Initializing needed DOM element variables

const app_pages = [...document.querySelectorAll("[data-app-page]")]


const category_cards = [...document.querySelectorAll("[data-category-card]")]
const people_cards = [...document.querySelectorAll("[data-people-card]")]


const next_buttons = [...document.querySelectorAll("[data-button-next]")]
const previous_buttons = [...document.querySelectorAll("[data-button-previous]")]
const start_over_button = document.querySelector("[data-button-start-over]")


const custom_generate_button = document.querySelector("[data-button-generate-custom]")
const flexible_generate_button = document.querySelector("[data-button-generate-flexible]")
const random_generate_button = document.querySelector("[data-button-random]")







// Creating a cost range selector from imported class
import * as rs from "./range_selector.js"

// Initializing all HTML elements that will be needed for the cost range selector

// Min and max mean the left and the right selector of a given slider
const cost_range_selector_min_tip = document.querySelector("[data-slider-min-selector]")
const cost_range_selector_max_tip = document.querySelector("[data-slider-max-selector]")

// Selected range visualizer
const range_visualizer = document.querySelector("[data-slider-range-visualizer]")

// Text underneath the range selector
const range_selector_min_text_visualizer = document.querySelector("[data-range-selector-min-text]")
const range_selector_max_text_visualizer = document.querySelector("[data-range-selector-max-text]")

// Initializing values for the range_selector
const cost_range_selector_default_range = [0, 10]
const cost_range_selector_min_range_gap = 1


// Making an area around the range selector not scrollable on mobile devices

document.querySelector(".range-selector").addEventListener("touchmove", e =>{
  if(e.target != cost_range_selector_min_tip && e.target != cost_range_selector_max_tip){
    e.preventDefault()
  }
})


// Defining the cost range selector from the imported class

const cost_range_selector = new rs.RangeSelector(
  cost_range_selector_min_tip,
  cost_range_selector_max_tip,
  range_visualizer,
  cost_range_selector_default_range,
  cost_range_selector_min_range_gap,
  range_selector_min_text_visualizer,
  range_selector_max_text_visualizer
)

// Cost range selector initialization
cost_range_selector.initializeSlider()
cost_range_selector.adjustRangeVisualizer()







// Global variables

// A variable needed to prevent a last page rendering bug
let last_page_rendered = true









// === DOM ContentLoaded event - retreiving local storage info ===



// Local storage management
// Loading all things that were stored in local
// storage. If there are no such things we initialize
// variables to default values

document.addEventListener("DOMContentLoaded", e => {

  if (localStorage.getItem("current_page") != null){

    // If we reload the page when on last page,
    // I want to keep whatever activity the user
    // got without re-generating a new one.
    // 5% use case, but it is an important detail
    // for me.
    if(parseInt(localStorage.getItem("current_page")) == 4){
      
      // Load the last activity that was generated to the DOM (From local storage)
      app_pages[parseInt(localStorage.getItem("current_page"))].classList.add("form-page--status-active")
      pasteAPIDataToDOM(localStorage.getItem("last_API_output").split("/"))
    }


    else{
      // Go to wherever we stopped
      handleNavigation(parseInt(localStorage.getItem("current_page")))
    }




  }
  
  else{
    // Go to the first page
    localStorage.setItem("current_page", 0)
    handleNavigation(parseInt(localStorage.getItem("current_page")))
  }

  


  if (localStorage.getItem("selected_category_cards") != null){
    let selected_category_cards

    selected_category_cards = JSON.parse(localStorage.getItem("selected_category_cards"))

    


    // Marking category cards selected based on local storage data
    selected_category_cards.forEach((elem, index) => {
      if (elem){
        category_cards[index].classList.add("category-card--status-active")
      }
    })
  }
  
  else{

    let selected_category_cards

    selected_category_cards = new Array(category_cards.length).fill(false)
    localStorage.setItem("selected_category_cards", JSON.stringify(selected_category_cards))
  }




  if (localStorage.getItem("selected_people_cards") != null){
    let selected_people_cards
    selected_people_cards = JSON.parse(localStorage.getItem("selected_people_cards"))

    // Marking people cards selected based on local storage data
    selected_people_cards.forEach((elem, index) => {
      if (elem){
        people_cards[index].classList.add("people-card--status-active")
      }
    })
  }
  
  else{
    
    let selected_people_cards = new Array(people_cards.length).fill(false)
    localStorage.setItem("selected_people_cards", JSON.stringify(selected_people_cards))
  }

  if (localStorage.getItem("cost_range") != null){

    cost_range_selector.current_range = JSON.parse(localStorage.getItem("cost_range"))

    cost_range_selector.initializeSlider()
    cost_range_selector.adjustRangeVisualizer()
    cost_range_selector.updateRangeText()
  }


  if (localStorage.getItem("last_generation_was_random") == null){
    localStorage.setItem("last_generation_was_random", false)
  }

})










// === Navigation buttons' logic === 

// All of these buttons essentially call Handle Navigation function
// That comes right after these event listeners.



// Navigating one step forwards
next_buttons.forEach(elem => elem.addEventListener("click", e => {

  handleNavigation(parseInt(localStorage.getItem("current_page")) + 1)

}))


// Navigating one step backwards
previous_buttons.forEach(elem => elem.addEventListener("click", e => {

  handleNavigation(parseInt(localStorage.getItem("current_page")) - 1)

}))





// Navigating back to start
start_over_button.addEventListener("click", e => {

  handleNavigation(0)

})





// Navigating to the last page
flexible_generate_button.addEventListener("click", () => {

  handleNavigation(4)
})


// Navigating to the last page
random_generate_button.addEventListener("click", () => {
  
  localStorage.setItem("last_generation_was_random", true)
  
  handleNavigation(4)

})


// Navigating to the last page
custom_generate_button.addEventListener("click", () => {
  
  localStorage.setItem("last_generation_was_random", false)

  handleNavigation(4)


})


















// === Page navigation manager ===


function handleNavigation(destination_page){


  let current_page = parseInt(localStorage.getItem("current_page"))

  // Not really used, but kept for easier comprehension
  const first_page_index = 0
  const middle_pages_indexes = [1, 2, 3]
  const last_page_index = 4


  // If we just opened the site and current page is not defined yet
  if (current_page == undefined){

    app_pages[destination_page].classList.add("form-page--status-active")

    current_page = destination_page
  
    // Save current location to local storage
    localStorage.setItem("current_page", current_page)

    return
  }




  // If we're visiting one of the middle pages
  if (middle_pages_indexes.includes(destination_page)){


    // If we're moving forwards
    if (destination_page > current_page){
      app_pages[destination_page].classList.add("form-page--animation-navigation-forwards")

    }


    // We're moving backwards
    else{
      app_pages[destination_page].classList.add("form-page--animation-navigation-backwards")

    }
  }




  // If we're leaving one of the middle pages

  if (middle_pages_indexes.includes(current_page)){
    app_pages[current_page].classList.remove("form-page--animation-navigation-forwards")
    app_pages[current_page].classList.remove("form-page--animation-navigation-backwards")
  }


  
  // If we're entering the last page
  if (destination_page == last_page_index){
    makeAPIRequest(JSON.parse(localStorage.getItem("last_generation_was_random")))
  }




  // If we're leaving last page
  if (current_page == last_page_index){

    const last_page_animated_paragraph_elements = [...document.querySelector("[data-output-paragraph]").children]

    // Remove all animations from the page elements
    last_page_animated_paragraph_elements.forEach(elem => {
      elem.classList.remove("output-page-paragraph-text-animation")
      elem.classList.remove("output-page-paragraph-separator-animation")
    })

  }


  // If we're navigating from last page to last page
  // Used for retriggering the output animation
  if (current_page == last_page_index && destination_page == last_page_index){

    if (last_page_rendered == true){
      app_pages[current_page].classList.remove("form-page--status-active")
      app_pages[current_page].offsetWidth
      app_pages[current_page].classList.add("form-page--status-active")
      last_page_rendered = false
    }

  }




  app_pages[current_page].classList.remove("form-page--status-active")
  app_pages[destination_page].classList.add("form-page--status-active")

  current_page = destination_page

  // Save current location to local storage
  localStorage.setItem("current_page", current_page)
}












// === User input collectors ===


// Categories

category_cards.forEach((elem, index) => elem.addEventListener("click", e =>{

  e.currentTarget.classList.toggle("category-card--status-active")
  
  let selected_category_cards = JSON.parse(localStorage.getItem("selected_category_cards"))

  // toggle the true-false value of selected items
  selected_category_cards[index] = !selected_category_cards[index]


  // Update local storage
  localStorage.setItem("selected_category_cards", JSON.stringify(selected_category_cards))


}))


// People

people_cards.forEach((elem, index) => elem.addEventListener("click", e =>{

  e.currentTarget.classList.toggle("people-card--status-active")

  let selected_people_cards = JSON.parse(localStorage.getItem("selected_people_cards"))

  // toggle the true-false value of selected items
  selected_people_cards[index] = !selected_people_cards[index]



  // Update local storage
  localStorage.setItem("selected_people_cards", JSON.stringify(selected_people_cards))


}))


// Cost range

cost_range_selector.range_selector_min_tip.addEventListener("input", (e) =>{
  
  if(parseInt(e.target.value) + cost_range_selector.min_selectors_gap > cost_range_selector.current_range[1]){
    e.target.value = parseInt(cost_range_selector.range_selector_max_tip.value) - 1
  }
  cost_range_selector.current_range[0] = parseInt(e.target.value)

  cost_range_selector.adjustRangeVisualizer()
  cost_range_selector.updateRangeText()

  // Saving range to local storage
  localStorage.setItem("cost_range", JSON.stringify(cost_range_selector.current_range))

})


  // Adding input validation on the right marker
  cost_range_selector.range_selector_max_tip.addEventListener("input", (e) => {
    if(parseInt(e.target.value) - cost_range_selector.min_selectors_gap < cost_range_selector.current_range[0]){
      e.target.value = parseInt(cost_range_selector.range_selector_min_tip.value) + 1
    }
    cost_range_selector.current_range[1] = parseInt(e.target.value)

    cost_range_selector.adjustRangeVisualizer()
    cost_range_selector.updateRangeText()

    // Saving range to local storage
    localStorage.setItem("cost_range", JSON.stringify(cost_range_selector.current_range))
    

  })















// === URL generator for the API request ===
// (Using some of the utils.js functions)


// Master function
function generateUrl(){

  let url = ""

  url += utils.initializeUrl()

  
  url += utils.generateCategoryUrl(JSON.parse(localStorage.getItem("selected_category_cards")))
  url += utils.generatePeopleUrl(JSON.parse(localStorage.getItem("selected_people_cards")))
  url += utils.generateCostUrl(cost_range_selector.current_range)

  return url
}













// If the request was random, then call rand url generator,
// (initializeUrl), if it was not random - generate a url
// using the generateUrl function.

// Initialize url gives random because by default if you
// Don't provide any input, you get a random response. That's
// Why initializer functions like a random url generator.


function makeAPIRequest(random){
  random
  ? fetchData(utils.initializeUrl())
  : fetchData(generateUrl())
}













// === API request sender and output collector ===

async function loadData(url){
  const response = await fetch(url);
  const data = await response.json()
  
  return data
}

async function fetchData(url){
  let data = []
  try{
    data = await loadData(url)
  }
  catch(error){
    console.log("Error!");
    console.log(error);
    alert("Error fetching data. Please come again later")
  }


  if(data.error == undefined){
    pasteAPIDataToDOM(utils.formatAPIOutput(data))
  }

  else{
    const error_data = ["Could not find an activity with the specified parameters", "", "", ""]
    pasteAPIDataToDOM(error_data)
  }

}



// === Function that pastes API output into the DOM (On last page) ===

function pasteAPIDataToDOM(formatted_data){


  // Activity description

  const output_heading = document.querySelector("[data-output-heading]")
  output_heading.innerText = formatted_data[0]


  // If the data contains my custom error message, then render it only,
  // without rendering the details we usually render (category, participants, price)

  if(formatted_data[0] == "Could not find an activity with the specified parameters"){
    document.querySelector("[data-output-paragraph]").style.display = "none"
  }




  // If we're rendering a standard responce, make details paragraph visible
  else{
    document.querySelector("[data-output-paragraph]").style.display = "flex"
  }




  // Activity details

  const output_paragraph = document.querySelector("[data-output-paragraph]")
  const paragraphs = [...output_paragraph.children].filter(node => node.tagName == "P")
  

  // Activity category
  paragraphs[0].innerText = formatted_data[1]


  // Activity participants number
  paragraphs[1].innerText = formatted_data[2] + " "
  const person_icon = document.createElement('i')
  person_icon.classList.add("fa-regular", "fa-user")
  paragraphs[1].appendChild(person_icon)


  // Activity cost
  paragraphs[2].innerText = formatted_data[3]


  localStorage.setItem("last_API_output", formatted_data[0] + "/" + formatted_data[1] + "/" + formatted_data[2] + "/" + formatted_data[3])
}





// === API output animator ===


// Animating API output

const ouput_page = document.querySelector("[data-output-page]")
ouput_page.addEventListener("animationend", e => {



  // If we're done rendering the page
  if(e.animationName == "output-page-render"){

    last_page_rendered = true

    
    const output_paragraph = e.target.querySelector("[data-output-paragraph]")
    const output_paragraph_elements = [...output_paragraph.children]


    output_paragraph_elements[0].classList.add("output-page-paragraph-text-animation")


    for (let index = 0; index < output_paragraph_elements.length - 1; index++) {
      output_paragraph_elements[index].addEventListener("animationend", e => {

        if(output_paragraph_elements[index + 1].tagName == "P"){
          output_paragraph_elements[index + 1].classList.add("output-page-paragraph-text-animation")
        }
        else{
          output_paragraph_elements[index + 1].classList.add("output-page-paragraph-separator-animation")
        }

      })
    }
  }
})