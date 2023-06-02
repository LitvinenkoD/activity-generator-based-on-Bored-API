import * as utils from "./helper_functions.js";




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
const cost_range_selector_min_tip = document.querySelector(".slider__min-selector")
const cost_range_selector_max_tip = document.querySelector(".slider__max-selector")

// Selected range visualizer
const range_visualizer = document.querySelector(".slider__range_visualizer")

// Text underneath the range selector
const range_selector_min_text_visualizer = document.querySelector(".range-selector__min-text")
const range_selector_max_text_visualizer = document.querySelector(".range-selector__max-text")

// Initializing values for the range_selector
const cost_range_selector_default_range = [0, 10]
const cost_range_selector_min_range_gap = 1



//================================================

document.querySelector(".range-selector").addEventListener("touchmove", e =>{
  e.preventDefault()
})

//=============================================



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
cost_range_selector.adjustRangeVisualizator()







// These are some global variables I'm using.
// They don't have to be global, but it feels easier
// managing the program with them. They always store
// the

// let selected_category_cards
// let selected_people_cards
// cost range is contained inside range_selector class instance









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
      loadLastActivityGenerated()
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
    cost_range_selector.adjustRangeVisualizator()
    cost_range_selector.updateRangeText()
  }


  if (localStorage.getItem("last_generation_was_random") == null){
    localStorage.setItem("last_generation_was_random", false)
  }

})










function loadLastActivityGenerated(){
  app_pages[parseInt(localStorage.getItem("current_page"))].classList.add("form-page--status-active")
  pasteAPIDataToDOM(localStorage.getItem("last_API_output").split("/"))
}












// Page navigation

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


















// Handling navigation

function handleNavigation(destination_page){


  let current_page = parseInt(localStorage.getItem("current_page"))

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



  // ====================================================================================
  // If we're entering the last page dynamically
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
    app_pages[current_page].classList.remove("form-page--status-active")
    app_pages[current_page].offsetWidth
    app_pages[current_page].classList.add("form-page--status-active")
  }




  app_pages[current_page].classList.remove("form-page--status-active")
  app_pages[destination_page].classList.add("form-page--status-active")

  current_page = destination_page

  // Save current location to local storage
  localStorage.setItem("current_page", current_page)
}















// Collecting user input


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

  cost_range_selector.adjustRangeVisualizator()
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

    cost_range_selector.adjustRangeVisualizator()
    cost_range_selector.updateRangeText()

    // Saving range to local storage
    localStorage.setItem("cost_range", JSON.stringify(cost_range_selector.current_range))
    

  })















// Url generation functions

// Master function
function generateUrl(){

  let url = ""

  url += utils.initializeUrl()

  
  url += utils.generateCategoryUrl(JSON.parse(localStorage.getItem("selected_category_cards")))
  url += utils.generatePeopleUrl(JSON.parse(localStorage.getItem("selected_people_cards")))
  url += utils.generateCostUrl(cost_range_selector.current_range)

  return url
}













// Generating and then sending an API request to API handler

function makeAPIRequest(random){
  random
  ? fetchData(utils.initializeUrl())
  : fetchData(generateUrl())
}





// Handling API requests

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



// Animating API output

const ouput_page = document.querySelector("[data-output-page]")
ouput_page.addEventListener("animationend", e => {



  // If we're done rendering the page
  if(e.animationName == "output-page-render"){

    
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