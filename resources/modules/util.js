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

export {debounce, swapClass};