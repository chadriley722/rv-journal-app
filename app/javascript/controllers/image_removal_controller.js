import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  removeImage(event) {
    event.preventDefault()
    
    // Find the form and set the remove_image value to '1'
    const form = this.element.closest('form')
    const hiddenField = form.querySelector('input[type="hidden"][name$="[remove_image]"]')
    if (hiddenField) {
      hiddenField.value = '1'
    }
    
    // Submit the form
    form.requestSubmit()
  }
}
