


// Initializer function
export function initializeUrl(){
  // This string a universal beginning of any request to this api,
  // If you want to customize request you add data to the string,
  // otherwise you can leave it as is and the api will generate
  // a random result for you.
  return "https://www.boredapi.com/api/activity?"
}


// Category url generator
export function generateCategoryUrl(selected_category_cards){
  let categories = ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"]

  let category_url = ""
  selected_category_cards.forEach((elem, index) => {
    if (elem){
      category_url += `type=${categories[index]}&`
    }
  })

  return category_url

}



// People url generator
export function generatePeopleUrl(selected_people_cards){

  // Api has options for 1 - 8 participants
  let people = [1, 2, 3, 4, 5, 6, 7, 8]

  let people_url = ""

  // For all items below index 3 (3 + option), append normally
  selected_people_cards.forEach((elem, index) => {
    if (elem && index <= 2){
      people_url += `participants=${people[index]}&`
    }


    // If option 3 + selected, populate the url with all options at or above index 3 (4, 5, 7, 8 participants)
    if (elem && index == 3){
      people.forEach((elem_nested, index_nested) =>{
        if(index_nested >= 3){
        people_url += `participants=${people[index_nested]}&`
        }
      })
    }
  })

  return people_url
}



// Cost url generators
export function generateCostUrl(cost_range){

  let cost_url = ""

  // API accepts values from 0 to 1, so 
  // we divide by 10 to format the request
  // properly
  cost_url += `minprice=${cost_range[0] / 10}&`
  cost_url += `maxprice=${cost_range[1] / 10}`

  return cost_url
}




















// Takes in an API response and formats it into an array of 4 elements
// ["Activity name", "Activity category", "Activity participants number", "Activity cost"]
export function formatAPIOutput(API_data){


  // Activity name
  const activity_name = API_data.activity


  // Activity category
  let activity_category = [...API_data.type]
  activity_category[0] = activity_category[0].toUpperCase()

  activity_category = activity_category.join("")



  // Activity participants number
  let activity_participants_number = API_data.participants

  if (activity_participants_number > 3){
    activity_participants_number = "3+"
  }

  activity_participants_number = activity_participants_number.toString()



  // Activity cost

  // There are 3 cost groups - $, $$, and $$$
  // activity cost * 10 is in between 0 and 10 units.
  // I didvide this into 3 intervals and assign
  // a respective cost visualization

  let activity_cost = API_data.price * 10
  let cost_visualization

  if (activity_cost <= 3){
    cost_visualization = "$"
  }

  if (activity_cost > 3 && activity_cost <=6){
    cost_visualization = "$$"
  }

  if (activity_cost > 6){
    cost_visualization = "$$$"
  }



  return [activity_name, activity_category, activity_participants_number, cost_visualization]
}
