

const dataRecord = {
  state: {
    lpCheckedList: ['MeasureTime', 'Lasp', 'Lafp', 'Laip', 'Lcsp', 'Lcfp', 'Lcip', 'Lzsp', 'Lzfp', 'Lzip'],
    leq1sCheckedList: ['MeasureTime', 'LeqA', 'LeqC', 'LeqZ'],
    octCheckedList: ['MeasureTime', '16', '31/5', '63', '125', '250', '500', '1000', '2000', '4000', '8000', '16000'],
    oct13CheckedList: ['MeasureTime', '10', '12/5', '16', '20', '25', '31/5', '40', '50', '63', '80', '100', '125', '160', '200', '250', '315', '400', '500', '630', '800', '1000', '1250', '1600', '2000', '2500', '3150', '4000', '5000', '6300', '8000', '10000', '12500', '16000', '20000'],
  },

  mutations: {
    SET_LPCHECKEDLIST: (state, lpCheckedList) => {
      state.lpCheckedList = lpCheckedList
    },

    SET_LEQ1SCHECKEDLIST: (state, leq1sCheckedList) => {
      state.leq1sCheckedList = leq1sCheckedList
    },

    SET_OCTCHECKEDLIST: (state, octCheckedList) => {
      state.octCheckedList = octCheckedList
    },

    SET_OCT13CHECKEDLIST: (state, oct13CheckedList) => {
      state.oct13CheckedList = oct13CheckedList
    }
  }
}

export default dataRecord