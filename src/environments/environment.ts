// This file can be replaced dSERVER_URIng build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  
  production: false,
  //apiUrl: 'http://localhost:3001/api/v1',  // for local
  //backendurlImages : 'http://localhost:3001',

  apiUrl : 'http://16.24.69.142:3001/api/v1', // for dev server
  backendurlImages : 'http://16.24.69.142:3001',

  SERVICE_APIS: {

    GET_ALL_DASHBOARD : '/global/getAlldashboard',
    
    // Masters api 

    GET_ALL_COUNTRY : '/country/getAllcountry',
    ADD_COUNTRY : '/country/addcountry',
    UPDATE_COUNTRY : '/country/updatecountry',
    DELETE_COUNTRY : '/country/deletecountry',
    BULK_DELETE : '/country/deletecountry',
    SPECIFIC_COUNTRY :'/country/getcountryById',
    BULK_COUNTRY_DELETE : '/country/bulkdelete',

    GET_ALL_TYPE : '/type/getAlltype',
    ADD_TYPE : '/type/addtype',
    UPDATE_TYPE : '/type/updatetype',
    DELETE_TYPE : '/type/deletetype',
    SPECIFIC_TYPE :'/type/gettypeById',
    BULK_TYPE_DELETE : '/type/bulkdelete',

    GET_ALL_COLOR : '/color/getAllcolor',
    ADD_COLOR : '/color/addcolor',
    UPDATE_COLOR : '/color/updatecolor',
    DELETE_COLOR : '/color/deletecolor',
    SPECIFIC_COLOR :'/color/getcolorById',
    BULK_COLOR_DELETE : '/color/bulkdelete',

    GET_ALL_CARE : '/care/getAllcare',
    ADD_CARE : '/care/addcare',
    UPDATE_CARE : '/care/updatecare',
    DELETE_CARE : '/care/deletecare',
    SPECIFIC_CARE :'/care/getcareById',
    BULK_CARE_DELETE : '/care/bulkdelete',

    GET_ALL_BRAND : '/brand/getAllbrand',
    ADD_BRAND : '/brand/addbrand',
    UPDATE_BRAND : '/brand/updatebrand',
    DELETE_BRAND : '/brand/deletebrand',
    SPECIFIC_BRAND :'/brand/getbrandById',
    BULK_BRAND_DELETE : '/brand/bulkdelete',

    GET_ALL_BANNER : '/banner/getAllbanner',
    ADD_BANNER : '/banner/addbanner',
    UPDATE_BANNER : '/banner/updatebanner',
    DELETE_BANNER : '/banner/deletebanner',
    SPECIFIC_BANNER :'/banner/getbannerById',
    BULK_BANNER_DELETE : '/banner/bulkdelete',

    GET_ALL_SIZE : '/size/getAllsize',
    ADD_SIZE : '/size/addsize',
    UPDATE_SIZE : '/size/updatesize',
    DELETE_SIZE : '/size/deletesize',
    SPECIFIC_SIZE :'/size/getsizeById',
    BULK_SIZE_DELETE : '/size/bulkdelete',

    GET_ALL_LENGTH : '/length/getAlllength',
    ADD_LENGTH : '/length/addlength',
    UPDATE_LENGTH : '/length/updatelength',
    DELETE_LENGTH : '/length/deletelength',
    SPECIFIC_LENGTH :'/length/getlengthById',
    BULK_LENGTH_DELETE : '/length/bulkdelete',

    GET_ALL_FABRIC : '/fabric/getAllfabric',
    ADD_FABRIC : '/fabric/addfabric',
    UPDATE_FABRIC : '/fabric/updatefabric',
    DELETE_FABRIC : '/fabric/deletefabric',
    SPECIFIC_FABRIC :'/fabric/getfabricById',
    BULK_FABRIC_DELETE : '/fabric/bulkdelete',

    //Inventory

    GET_ALL_CATEGORY : '/category/getAllcategory',
    ADD_CATEGORY : '/category/addcategory',
    UPDATE_CATEGORY : '/category/updatecategory',
    DELETE_CATEGORY : '/category/deletecategory',
    SPECIFIC_CATEGORY :'/category/getcategoryById',
    BULK_CATEGORY_DELETE : '/category/bulkdelete',
    
    GET_ALL_PRODUCT : '/product/getAllproduct',
    ADD_PRODUCT : '/product/addproduct',
    UPDATE_PRODUCT : '/product/updateproduct',
    DELETE_PRODUCT : '/product/deleteproduct',
    SPECIFIC_PRODUCT :'/product/getproductById',
    BULK_PRODUCT_DELETE : '/product/bulkdelete',

    GET_ALL_PROMOCODE : '/promocode/getAllpromocode',
    ADD_PROMOCODE : '/promocode/addpromocode',
    UPDATE_PROMOCODE : '/promocode/updatepromocode',
    DELETE_PROMOCODE : '/promocode/deletepromocode',
    SPECIFIC_PROMOCODE :'/promocode/getpromocodeById',
    BULK_PROMOCODE_DELETE : '/promocode/bulkdelete',

    GET_ALL_PROMOTION : '/promotion/getAllpromotion',
    ADD_PROMOTION : '/promotion/addpromotion',
    UPDATE_PROMOTION : '/promotion/updatepromotion',
    DELETE_PROMOTION : '/promotion/deletepromotion',
    SPECIFIC_PROMOTION :'/promotion/getpromotionById',
    BULK_PROMOTION_DELETE : '/promotion/bulkdelete',
    //Services

    GET_ALL_TAILORING_SERVICE : '/service/getAllservice',
    ADD_TAILORING_SERVICE : '/service/addservice',
    UPDATE_TAILORING_SERVICE : '/service/updateservice',
    DELETE_TAILORING_SERVICE : '/service/deleteservice',
    SPECIFIC_TAILORING_SERVICE :'/service/getserviceById',
    BULK_TAILORING_SERVICE_DELETE : '/service/bulkdelete',

    //Pages

    GET_ALL_PAGE : '/page/getallpage',
    ADD_PAGE : '/page/addpage',
    UPDATE_PAGE : '/page/updatepage',
    DELETE_PAGE : '/page/deletepage',
    SPECIFIC_PAGE :'/page/getpageById',
    SPECIFIC_PAGE_NAME :'/page/getpageByName',
    BULK_PAGE_DELETE : '/page/bulkdelete',

    //FAQ

    GET_ALL_FAQ : '/faq/getAllfaq',
    ADD_FAQ : '/faq/addfaq',
    UPDATE_FAQ : '/faq/updatefaq',
    DELETE_FAQ : '/faq/deletefaq',
    SPECIFIC_FAQ :'/faq/getfaqById',
    BULK_FAQ_DELETE : '/faq/bulkdelete',
    
    //Currency

    GET_ALL_CURRENCY : '/currency/getAllcurrency',
    ADD_CURRENCY : '/currency/addcurrency',
    UPDATE_CURRENCY : '/currency/updatecurrency',
    DELETE_CURRENCY : '/currency/deletecurrency',
    SPECIFIC_CURRENCY :'/currency/getcurrencyById',
    BULK_CURRENCY_DELETE : '/currency/bulkdelete',

    //CONVERSION RATE
    GET_ALL_CONVERSION_RATE : '/currency/getAllconversionrate',
    ADD_CONVERSION_RATE : '/currency/addconversionrate',
    UPDATE_CONVERSION_RATE : '/currency/updateconversionrate',
    DELETE_CONVERSION_RATE : '/currency/deleteconversionrate',
    SPECIFIC_CONVERSION_RATE :'/currency/getconversionrateById',
    SAVE_UPDATE_CONVERSION_RATE :'/currency/bulkSaveOrUpdate ',
    
    //role

    GET_ALL_ROLE : '/role/getAllrole',
    GET_ALL_MENU : '/menu/getAllmenu?page=1&size=100',

    ADD_ROLE : '/role/addrole',
    UPDATE_ROLE : '/role/updaterole',
    DELETE_ROLE : '/role/deleterole',
    SPECIFIC_ROLE :'/role/getroleById',
    BULK_ROLE_DELETE : '/role/bulkdelete',

    // Privilege

    GET_ALL_PRIVILEGE : '/menu/privilege',
    ADD_PRIVILEGE : '/menu/privilege',
    UPDATE_PRIVILEGE : '/menu/privilege',
    DELETE_PRIVILEGE : '/menu/privilege',
    SPECIFIC_PRIVILEGE :'/menu/privilege',
    BULK_PRIVILEGE_DELETE : '/menu/bulkdeleteprivilege',

    //paymentmethod

    GET_ALL_PAYMENT_METHOD : '/paymentmethod/getAllpaymentmethod',
    ADD_PAYMENT_METHOD : '/paymentmethod/addpaymentmethod',
    UPDATE_PAYMENT_METHOD : '/paymentmethod/updatepaymentmethod',
    DELETE_PAYMENT_METHOD : '/paymentmethod/deletepaymentmethod',
    SPECIFIC_PAYMENT_METHOD :'/paymentmethod/getpaymentmethodById',
    BULK_PAYMENT_METHOD_DELETE : '/paymentmethod/bulkdelete',

    //Email templates
    
    GET_ALL_EMAIL_TEMPLATES : '/template/getAllemailtemplates',
    ADD_EMAIL_TEMPLATES : '/template/addemailtemplates',
    UPDATE_EMAIL_TEMPLATES : '/template/updateemailtemplates',
    DELETE_EMAIL_TEMPLATES : '/template/deleteemailtemplates',
    SPECIFIC_EMAIL_TEMPLATES :'/template/getemailtemplatesById',
    BULK_EMAIL_TEMPLATES_DELETE : '/template/bulkdelete',

    //Email templates
    
    GET_ALL_ORDERS : '/cart/getAllorders',
    GET_ALL_INVOICES : '/cart/getAllpayment',
    SPECIFIC_ORDER : '/cart/getorderById',
    DELETE_ORDER : '/cart/deleteorder',
    CREATE_ORDER : '/cart/manualorder',
    UPDATE_DEIVERY_STATUS : '/cart/updatedeliverystatus',
    
    // Site Information

    ADD_OR_UPDATE_SITE_DETAILS : '/global/addupdatesitedetails',
    GET_SITE_DETAILS : '/global/getsiteInfo',

    //MERCHANT

    GET_ALL_MERCHANT : '/merchant/getmerchantlist',
    ADD_MERCHANT : '/merchant/addmerchant',
    UPDATE_MERCHANT : '/merchant/updatemerchant',
    DELETE_MERCHANT : '/merchant/softdelete',
    COMPLETE_DELETE_MERCHANT : '/merchant/deletemerchant',
    SPECIFIC_MERCHANT :'/merchant/getmerchantById',
    BULK_MERCHANT_DELETE : '/merchant/bulkdelete',

    //DRIVER

    GET_ALL_DRIVER : '/driver/getdriverlist',
    ADD_DRIVER : '/driver/adddriver',
    UPDATE_DRIVER : '/driver/updatedriver',
    DELETE_DRIVER : '/driver/softdelete',
    COMPLETE_DELETE_DRIVER : '/driver/deletedriver',
    SPECIFIC_DRIVER :'/driver/getdriverById',
    BULK_DRIVER_DELETE : '/driver/bulkdelete',

    //Login - derziusers

    LOGIN_USER : '/derziuser/login',
    REFRESH_TOKEN:'/derziuser/token/refresh/',
    GET_ALL_DERZI_USERS_API : '/derziuser/getuserslist',
    SPECIFIC_DERZI_USERS_API : '/derziuser/getderziuserById',
    LOGOUT_API : '/derziuser/logout/',
    REGISTER_DERZI_USERS_APP : '/derziuser/register',
    UPDATE_DERZI_USERS_APP : '/derziuser/updateprofile',
    DELETE_DERZI_USERS_APP : '/derziuser/softdelete',
    COMPLETE_DELETE_DERZI_USERS : '/derziuser/deleteuser',
    BULK_DERZI_USERS_DELETE : '/derziuser/bulkdelete',

    //Userapp -users

    ADD_USER_APP : '/user/register',
    GET_ALL_USER_APP :'/user/getuserslist',
    UPDATE_USER_APP :'/user/updateuserprofile',
    DELETE_USER_APP :'/user/softdelete',
    COMPLETE_DELETE_USER_APP :'/user/deleteuser',
    BULK_USER_APP_DELETE :'/user/bulkdelete',
    SPECIFIC_USER_APP : '/user/getspecificuser',

    //EXPORT 

    EXPORT_DRIVER_CSV : '/export/exportDriversCSV',
    EXPORT_DRIVER_EXCEL : '/export/exportDriversExcel',

    EXPORT_MERCHANT_CSV : '/export/exportMerchantsCSV',
    EXPORT_MERCHANT_EXCEL : '/export/exportMerchantsExcel',

    EXPORT_USER_CSV : '/export/exportUserCSV',
    EXPORT_USER_EXCEL : '/export/exportUserExcel',

    EXPORT_ORDER_CSV : '/export/exportOrderCSV',
    EXPORT_ORDER_EXCEL : '/export/exportOrderExcel',

    EXPORT_PRODUCT_CSV : '/export/exportProductCSV',
    EXPORT_PRODUCT_EXCEL : '/export/exportProductExcel',

     //REVIEWS

     GET_ALL_REVIEWS : '/review/get_all_ratings',
     ADD_REVIEW : '/review/add_ratings',
     UPDATE_REVIEW : '/review/edit',
     DELETE_REVIEW : '/review/softdelete',
     COMPLETE_DELETE_REVIEW : '/review/delete',
     SPECIFIC_REVIEW :'/review/get_specific',
     APPROVE_REVIEW : '/review/approve',
     REJECT_REVIEW : '/review/reject',

  },  

  
}; 


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.