const debounce = (func, wait) => {
    let timeout;
  
    return (...args) => {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
};

const swapClass = (oldClass, newClass) => (array) => {
  array.forEach(e => {
      e.classList.remove(oldClass);
      e.classList.add(newClass)
  })
}

const applyToClass = (tag, func) => {
  Array.from(document.getElementsByClassName(tag))
  .forEach(ele => func(ele))
}

const buttonTimeout = (obj, dur=1000) => {
  let color = window.getComputedStyle(obj).getPropertyValue('color');
  obj.disabled = true;
  obj.style.color = '#FF5F5F';

  setTimeout(function() {
      obj.disabled = false;
      obj.style.color = color;
  }, dur);
}

export {debounce, swapClass, buttonTimeout, applyToClass};