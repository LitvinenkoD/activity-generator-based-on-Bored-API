export class RangeSelector{
  constructor(range_selector_min_tip, range_selector_max_tip, range_visualizer, current_range, sliders_min_gap, range_selector_min_text_visualizer, text_max){
    this.range_selector_min_tip = range_selector_min_tip
    this.range_selector_max_tip = range_selector_max_tip
    this.range_visualizer = range_visualizer


    // This array dynamically updates and always stores the value of min and max selectors
    this.current_range = current_range

    // Minimum acceptable distance between selectors
    this.min_selectors_gap = sliders_min_gap

    this.range_selector_min_text_visualizer = range_selector_min_text_visualizer
    this.text_max = text_max

  }

  // Sets values of the actual tips equal to the values we initialized before
  initializeSlider(){
    this.range_selector_min_tip.value = this.current_range[0]
    this.range_selector_max_tip.value = this.current_range[1]
  }


  // Updates the colored gap between two slider tips
  adjustRangeVisualizer(){
    const left = this.current_range[0] * 10
    const right = 100 - this.current_range[1] * 10
  
    this.range_visualizer.style.left = left + "%"
    this.range_visualizer.style.right = right + "%"
  }

  updateRangeText(){
    this.range_selector_min_text_visualizer.innerText = this.range_selector_min_tip.value
    this.text_max.innerText = this.range_selector_max_tip.value
  }
}