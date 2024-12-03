let BookStore = (function(){

  let _bookStore = getElem('book-store');
  let CLICK = 'click';
  var isLoginForm = true;

  function getElem(id){
    return document.getElementById(id);
  }

  function addEventListener(elem, action, callback){
    elem && elem.addEventListener(action, callback);
  }

  function showSuccessBanner(message){
    var banner =  '<div class="banner suces show-banner" id="popup">'+
                    message+'.'+
                  '</div>';
    removeOldBanner();      
    getElem('body').insertAdjacentHTML('beforeend', banner);
    removeBanner();
  }

  function showErrorBanner(message){
    var banner = '<div class="banner error show-banner" id="popup">'+
                    message+'.'+
                  '</div>';
    removeOldBanner();
    getElem('body').insertAdjacentHTML('beforeend', banner);
    removeBanner();
  }

  function removeOldBanner(){
    var body = getElem('body').childNodes;
    var popup = getElem('popup');
    body.forEach((elem)=>{
      if(elem == popup){
        elem.remove();
      }
    })
  }

  function removeBanner(){
    var popup = getElem('popup');
    setTimeout(()=>{
      popup.remove();
    }, 3000);
  }

  function setInLocalStorage(name, value){
    localStorage.setItem(name, JSON.stringify(value));
  }

  function getFromLocalStorage(name){
    return JSON.parse( localStorage.getItem(name) ) || [];
  }

  function getLoginHtml(isLogin){
    var confirmPasswordHtml = '';
    var title = '';

    var btn1Title = '';
    var btn1Id = '';
    var btn2Title = '';
    var btn2Id = '';

    if(!isLogin){
      confirmPasswordHtml = '<div class="form-fld">'+
                              '<div class="login-title">Confirm Password</div>'+
                              '<input type="password" id="confirm" placeholder="Enter Confirm Password">'+
                            '</div>';

      btn1Title = 'Login';
      btn2Title = 'Sign Up';
      btn1Id = 'login';
      btn2Id = 'sign-up';
    } else{
      btn1Title = 'Sign Up';
      btn2Title = 'Login';
      btn1Id = 'sign-up';
      btn2Id = 'login';
    }

    return  '<div class="loginwrap">'+
              '<div class="com-title">'+title+'</div>'+
              '<div class="form-fld">'+
                '<div class="login-title">Name</div>'+
                '<input type="text" id="name" value="" placeholder="Enter user name">'+
              '</div>'+
              '<div class="form-fld">'+
                '<div class="login-title">Password</div>'+
                '<input type="password" id="pass" value="" placeholder="Enter Password">'+
              '</div>'+
              confirmPasswordHtml+
              '<div class="butn-wrap">'+
                '<div class="butn signup btnBlue" id="'+btn1Id+'">'+btn1Title+'</div>'+
                '<div class="butn signup mL40 btnRed" id="'+btn2Id+'">'+btn2Title+'</div>'+
              '</div>'+
            '</div>'
  }

  function gotoSingUp(){
    _bookStore.innerHTML = getLoginHtml(!isLoginForm);
    addEventListener(getElem('sign-up'), CLICK, addUser);
    addEventListener(getElem('login'), CLICK, () => {
      _bookStore.innerHTML = getLoginHtml(isLoginForm);
      bindEvents();
    })
    addEventListener(getElem('confirm'), 'keyup', (e) => {
      (e.keyCode === 13) && addUser();
    })
  }

  function addUser(){
    var pass = getElem('pass').value;
    var name = getElem('name').value;
    var confirmPass = getElem('confirm').value;

    var isPassWordSame = pass === confirmPass;
    var isValidLength = pass.length < 8 ? false : true;
    
    var users = getFromLocalStorage('user');
    var userNames = getFromLocalStorage('usernames');

    if(!name || !isPassWordSame || !isValidLength){
      showErrorBanner('Enter valid input');
    }

    else if(userNames.includes(name)){
      showErrorBanner('User Name already registerd.')
    }

    else{
      users.push({name, pass});
      userNames.push(name);
      setInLocalStorage('user', users);
      setInLocalStorage('usernames', userNames);
      _bookStore.innerHTML = getLoginHtml(isLoginForm);
      showSuccessBanner('User Successfully Added');
    }
    bindEvents();
  }

  function login(){
    var users = getFromLocalStorage('user');
    var pass = getElem('pass').value;
    var name = getElem('name').value;
    var isLogin = false;

    if(name === 'admin' && pass === 'admin'){
      showSuccessBanner('Successfully login');
      setInLocalStorage('currentuser', 'admin');
      getAdminPageWrapperHtml();
      return;
    }


    users.forEach((user)=>{

      if(user.name === name && user.pass === pass){
        showSuccessBanner('Welcome '+name);
        setInLocalStorage('currentuser', name);
        gotoUserHome(name);
        isLogin = true;
        return;
      }
  
    })

    if(!isLogin){
      showErrorBanner('Invalid username or password');
    }

  }

  function getTableHeader(isAdmin){
    var customField = '';
    if(isAdmin){
      customField =  '<div class="w100">Quantity</div>'+
                      '<div class="w100">Add</div>'+
                      '<div class="w100">remove</div>';
    }
    else{
      customField = '<div class="w100">Status</div>'+
                    '<div class="w100">Get</div>';
    }
    return  '<div class="table-head">'+
              '<div class="w300">Name</div>'+
              '<div class="w300">Author</div>'+
              '<div class="w200">Price</div>'+
              customField+
            '</div>';
  }

  function table(isAdmin){

    var tableHtml = '<div class="table-wrap" id="table-container">';
    tableHtml += getTableHeader(isAdmin);
    var bookList = getFromLocalStorage('bookList');
    bookList.forEach((elem)=>{
      var quantity = elem.quantity;
      var customField = '';
      if(isAdmin){
        var className = quantity ? 'available' : 'sold';
        customField = '<div><span class="'+className+'">'+elem.quantity+'</span></div>'+
                      '<div><i class="fa fa-plus-circle" aria-hidden="true" data-book="'+elem.Bookname+'"></i></div>'+
                      '<div><i class="fa fa-minus-circle" aria-hidden="true" data-book="'+elem.Bookname+'"></i></div>';
      }
      else{
        var available = elem.quantity ? '<div><span class="available">Available</span></div>' : '<div><span class="sold">Sold Out</span></div>';
        customField = available+
                      '<div><div class="table-get get" data-book="'+elem.Bookname+'">Get</div></div>';
      }
      tableHtml +=  '<div class="table-list">'+
                      '<div>'+elem.Bookname+'</div>'+
                      '<div>'+elem.author+'</div>'+
                      '<div>'+elem.price+'</div>'+
                      customField+
                    '</div>';
    })
    tableHtml += '</div>';

    return tableHtml;
  }

  function getAdminPageWrapperHtml(){
    setTable();
    modifyQuantity();
  }

  function gotoUserHome(){
    setTable();
    modifyQuantity();
  }

  function modifyQuantity(){
    document.querySelectorAll('.fa-plus-circle').forEach((elem)=>{
      addEventListener(elem, CLICK, increaseQuantity);
    })
    document.querySelectorAll('.fa-minus-circle').forEach((elem)=>{
      addEventListener(elem, CLICK, decreseQuantity);
    })
  }

  function increaseQuantity(e){
    var bookName = e.target.getAttribute('data-book');
    changeQuantity(bookName, true);
  }

  function changeQuantity(bookName, isAdd){
    var bookList = getFromLocalStorage('bookList');
    bookList.forEach((elem, index)=>{
      if(elem.Bookname === bookName){
        var quantity = elem.quantity;
        if(isAdd){
          elem.quantity += 1;
        }
        else if(quantity){
          elem.quantity -= 1;
        }
      }
    })
    setInLocalStorage('bookList', bookList);
    setTable();
  }

  function decreseQuantity(e){
    var bookName = e.target.getAttribute('data-book');
    changeQuantity(bookName, false);
  }

  function setTable(){

    var currentuser = getFromLocalStorage('currentuser');
    var isAdmin = currentuser === 'admin';
    
    
    var noOfBooks = getFromLocalStorage('bookNames').length;

    var leftBtn = isAdmin ? 'Add Book' : 'Order Book';
    var tableHtml = noOfBooks ? table(isAdmin) : '<div class="flexM fdirection"><i class="fa fa-book" aria-hidden="true"></i><p class="no-books">No Books there</p></div>'

    var html =  '<div class="admin-page">'+
                  '<div class="home-page-header" id="homePage">'+
                    '<div class="addbook" id="add-book" data-user="'+currentuser+'">'+leftBtn+'</div>'+
                    '<div id="log-out" class="logout">Logout</div>'+
                  '</div>'+
                  tableHtml+
                  '<div class="order" id="order-popup"></div>'+
                '</div>'

    _bookStore.innerHTML = html;

    var addBook = getElem('add-book');

    if(!isAdmin && !noOfBooks){
      addBook.style.pointerEvents = 'none';
    }
    modifyQuantity();
    addEventListener(addBook, CLICK, addNewBook);
    addEventListener(getElem('log-out'), CLICK, logout);
    document.querySelectorAll('.get').forEach((elem)=>{
      addEventListener(elem, CLICK, orderBook);
    })
  }

  function orderBook(e){
    var bookName = e.target.getAttribute('data-book');
    var bookList = getFromLocalStorage('bookList');
    var noStocks = false;
    bookList.forEach((elem)=>{
      if(elem.Bookname === bookName && elem.quantity <1){
        showErrorBanner('No Stocks')
        noStocks = true;
        return;
      }
    })

    if(!noStocks){
      addNewBook(e);
      var price, author;
      var bookList = getFromLocalStorage('bookList');
      bookList.forEach((elem)=>{
        if(elem.Bookname === bookName){
          price = elem.price;
          author = elem.author;
        }
      })
      getElem('price').value = price;
      getElem('author').value = author;
    }

  }

  function logout(){
    setInLocalStorage('currentuser', '');
    _bookStore.innerHTML = getLoginHtml(isLoginForm);
    bindEvents();
  }

  function addNewBook(e){
    var isAdmin = e.target.getAttribute('data-user') === 'admin';
    var bookName = e.target.getAttribute('data-book');
    var html = orderHtml(bookName);
    getElem('order-popup').innerHTML = html;
    if(!isAdmin){
      getElem('price').disabled = true;
      getElem('author').disabled = true;
      var bookField = getElem('book-name');
      if(bookName){
        bookField.disabled = true;
      }
      addEventListener(getElem('book-name'), CLICK, showDropDown)
    }

    if(bookName){
      getElem('book-name').disabled = true;
    }
    getElem('homePage').style.filter = 'blur(5px)';
    var tableContainer = getElem('table-container');
    if(tableContainer){
      tableContainer.style.filter = 'blur(5px)';
    }
    addEventListener(getElem('close-popup'), CLICK, closePopup);
    addEventListener(getElem('update'), CLICK, updateBook);
  }

  function showDropDown(){
    var result = getElem('result');
    if(result.style.display === 'none')
    {
      result.style.display = 'block';
      let bookList = getFromLocalStorage('bookList');
      AutoComplete.init(bookList, selectBook);
    }
    else{
      result.style.display = 'none';
    }
  }

  function selectBook(bookName){
    getElem('book-name').value = bookName;
    getElem('result').style.display = 'none';
    var bookList = getFromLocalStorage('bookList');
    bookList.forEach((elem)=>{
      if(elem.Bookname === bookName){
        getElem('price').value = elem.price;
        getElem('author').value = elem.author;
        return;
      }
    })
  }

  function updateBook(){
    var Bookname = getElem('book-name').value;
    var price = parseInt(getElem('price').value);
    var author = getElem('author').value;
    var quantity = parseInt(getElem('quantity').value);
    var bookNames = getFromLocalStorage('bookNames');
    var currentuser = getFromLocalStorage('currentuser');
    var isCorrectBook = false;

    if(!Bookname || !price || !author || !quantity){
      showErrorBanner('Fill all fields');
    }

    else if(currentuser !== 'admin'){
      var bookList = getFromLocalStorage('bookList');
      bookList.forEach((elem, index)=>{
        if(elem.Bookname === Bookname){
          isCorrectBook = true;
          if(elem.quantity < quantity){
            showErrorBanner('Less number of books available');
            return;
          }
          else{
            showSuccessBanner('Book Ordered Sucessfully');
            var orders = getFromLocalStorage('orders');
            orders.push({ Bookname, quantity, currentuser });
            bookList[index].quantity = elem.quantity - quantity;
            setInLocalStorage('bookList', bookList);
            closePopup();
            setTable();
            return;
          }
        }
      })

      if(!isCorrectBook){
        showErrorBanner('Enter valid book name');
      }
    }

    else if(price < 0 || quantity < 0){
      showErrorBanner('Price and Quantity is must greater than 0');
    }

    else if(bookNames.includes(Bookname)){
      showErrorBanner('This book already registered');
    }

    else{
      showSuccessBanner('Book Added Sucessfully');
      var bookList = getFromLocalStorage('bookList');
      bookList.push({Bookname, price, author, quantity});
      bookNames.push(Bookname);
      setInLocalStorage('bookList', bookList);
      setInLocalStorage('bookNames', bookNames);
      closePopup();
      setTable();
    }

  }

  function closePopup(){
    getElem('homePage').style.filter = 'none';
    var tableContainer = getElem('table-container');
    if(tableContainer){ 
      tableContainer.style.filter = 'none';
    }
    getElem('order-popup').innerHTML = '';
  }

  function orderHtml(bookName){

    var bookName = bookName || '';

    return  '<div class="order-wrap" id="login-wrapper">'+
              '<div id="close-popup"><i class="fa fa-window-close" aria-hidden="true"></i></div>'+
              '<div class="com-title">Order</div>'+
              '<div class="form-fld">'+
                '<div class="login-title">Bookname</div>'+
                '<input type="text" placeholder="Enter book name" id="book-name" value="'+bookName+'">'+
              '</div>'+
              '<div class="drpdwn-result" id="result" style="display: none;"></div>'+
              '<div class="form-fld">'+
                '<div class="login-title">price</div>'+
                '<input type="number" min="1" placeholder="Enter price" id="price">'+
              '</div>'+
              '<div class="form-fld">'+
                '<div class="login-title">Author</div>'+
                '<input type="text" placeholder="Enter author name" id="author">'+
              '</div>'+
              '<div class="form-fld">'+
                '<div class="login-title">quantity</div>'+
                '<input type="number" min="1" placeholder="Enter quantity" id="quantity">'+
              '</div>'+
              '<div class="butn-wrap">'+
                '<div class="butn" id="update" >Update</div>'+
              '</div>'+
            '</div>';
  }

  function bindEvents(){
    addEventListener(getElem('sign-up'), CLICK, gotoSingUp);
    addEventListener(getElem('login'), CLICK, login);
    addEventListener(document, 'keyup', (e)=>{ if(e.keyCode === 27){ closePopup();}});
    addEventListener(getElem('pass'), 'keyup', (e) => {(e.keyCode === 13) && login();})
  }

  function populateUI(){
    var currentuser = getFromLocalStorage('currentuser');
    if(currentuser === 'admin'){
      getAdminPageWrapperHtml();
      return;
    }
    else if( currentuser.length ){
      gotoUserHome(currentuser);
      return;
    }
    _bookStore.innerHTML = getLoginHtml(isLoginForm);
  }

  return{
    init : function(){
      populateUI();
      bindEvents();
    }
  }
}());