/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

// 🔹 Map each title to an id + icon
const menuConfig: Record<string, { id: string; icon: string }> = {
    Dashboard: { id: 'dashboard', icon: 'heroicons_outline:chart-pie' },
    Masters: { id: 'masters', icon: 'heroicons_outline:information-circle' },
    Countries: { id: 'countries', icon: 'heroicons_outline:flag' },
    Type: { id: 'type', icon: 'heroicons_outline:squares-2x2' },
    Brand: { id: 'brand', icon: 'heroicons_outline:tag' },
    Banners: { id: 'banners', icon: 'heroicons_outline:photo' },
    Length: { id: 'length', icon: 'heroicons_outline:arrows-right-left' },
    Fabric: { id: 'fabric', icon: 'heroicons_outline:view-columns' },
    Size: { id: 'size', icon: 'heroicons_outline:arrows-up-down' },
    Color: { id: 'color', icon: 'heroicons_outline:swatch' }, // use swatch-like icons
    Care: { id: 'care', icon: 'heroicons_outline:heart' },  
    Inventory: { id: 'inventory', icon: 'heroicons_outline:shopping-cart' },
    Categories: { id: 'categories', icon: 'heroicons_outline:tag' },
    Products: { id: 'products', icon: 'heroicons_outline:cube' },
    'Promo Code': { id: 'promocode', icon: 'heroicons_outline:ticket' },
    'Tailoring Services': { id: 'tailoring-services', icon: 'heroicons_outline:academic-cap' },
    Accounts: { id: 'accounts', icon: 'heroicons_outline:user-group' },
    Merchants: { id: 'merchants', icon: 'heroicons_outline:building-storefront' },
    Users: { id: 'users', icon: 'heroicons_outline:user' },
    Drivers: { id: 'drivers', icon: 'heroicons_outline:truck' },
  
    'Access Control': { id: 'access-control', icon: 'heroicons_outline:lock-closed' },
    Roles: { id: 'roles', icon: 'heroicons_outline:key' },
    Groups: { id: 'groups', icon: 'heroicons_outline:users' },
    'Privilege Management': { id: 'privilege', icon: 'heroicons_outline:shield-check' },
  
    Configuration: { id: 'configuration', icon: 'heroicons_outline:cog' },
    SMS: { id: 'sms', icon: 'heroicons_outline:device-tablet' },
    'Payment Gateway': { id: 'payment', icon: 'heroicons_outline:credit-card' },
    'Payment Method': { id: 'paymentmethods', icon: 'heroicons_outline:currency-rupee' },
    'Email Templates': { id: 'email', icon: 'heroicons_outline:envelope' },
    'SMS Templates': { id: 'sms-templates', icon: 'heroicons_outline:device-phone-mobile' },  
    'Page Management': { id: 'pages', icon: 'heroicons_outline:document-text' },
    Transactions: { id: 'transactions', icon: 'heroicons_outline:currency-dollar' },
    Reports: { id: 'reports', icon: 'heroicons_outline:chart-bar' },
    'Settings': { id: 'global-settings', icon: 'heroicons_outline:globe-alt' },
    'User Report': { id: 'user-report', icon: 'heroicons_outline:user-circle' },
    'Merchant Report': { id: 'merchant-report', icon: 'heroicons_outline:building-storefront' },
    'Driver Report': { id: 'driver-report', icon: 'heroicons_outline:truck' },
    'Orders Report': { id: 'orders-report', icon: 'heroicons_outline:clipboard-document-list' },
    'Products Report': { id: 'products-report', icon: 'heroicons_outline:cube' },
    'All Orders': { id: 'orders-report', icon: 'heroicons_outline:clipboard-document-list' },
    'Payment History': { id: 'orders-report', icon: 'heroicons_outline:credit-card' },
    'Invoices': { id: 'orders-report', icon: 'heroicons_outline:clipboard-document' },
     FAQ: { id: 'orders-report', icon: 'heroicons_outline:question-mark-circle' },
     'Global Settings': { id: 'orders-report', icon: 'heroicons_outline:globe-alt' },
     'Application Notification': { id: 'orders-report', icon: 'heroicons_outline:bell-alert' },
     'Message Center': { id: 'orders-report', icon: 'heroicons_outline:inbox' },
     'Currency': { id: 'orders-report', icon: 'heroicons_outline:currency-dollar' },
  };
  
  // 🔹 Function to apply ids/icons based on title
  function applyConfig(items: any[]): any[] {
    return items.map(item => {
      const config = menuConfig[item.title] || { id: item.title.toLowerCase(), icon: 'heroicons_outline:folder' };
  
      return {
        ...item,
        id: config.id,
        icon: item.icon || config.icon,
        children: item.children ? applyConfig(item.children) : undefined
      };
    });
  }
  
  // 🔹 Your final navigation
  export const defaultNavigation: FuseNavigationItem[] = applyConfig([
    {
      title: 'Dashboard',
      type: 'basic',
      link: '/dashboard',
    },
    {
      title: 'Masters',
      type: 'collapsable',
      children: [
        { title: 'Countries', type: 'basic', link: '/countries' },
        { title: 'Type', type: 'basic', link: '/type' },
        { title: 'Brand', type: 'basic', link: '/brand' },
        { title: 'Banners', type: 'basic', link: '/banners' },
        { title: 'Length', type: 'basic', link: '/length' },
        { title: 'Fabric', type: 'basic', link: '/fabric' },
        { title: 'Size', type: 'basic', link: '/size' },
        { title: 'Color', type: 'basic', link: '/color' },
        { title: 'Care', type: 'basic', link: '/care' },
      ],
    },
    {
      title: 'Inventory',
      type: 'collapsable',
      children: [
        { title: 'Categories', type: 'basic', link: '/categories' },
        { title: 'Products', type: 'basic', link: '/products' },
        { title: 'Promo Code', type: 'basic', link: '/promocode' },
      ],
    },
    {
        title: 'Tailoring Services',
        type: 'basic',
        link:'/services'
    },    
    { title: 'Page Management', type: 'basic', link: '/pages' },
    { 
        title: 'Transactions', 
        type: 'collapsable',
        children: [
            { title: 'All Orders', type: 'basic', link: '/allorders' },
            //{ title: 'Payment History', type: 'basic', link: '/transactions/history' },
            { title: 'Invoices', type: 'basic', link: '/invoices' }, 
        ],
    },
    
    {
        title: 'Accounts',
        type: 'collapsable',
        children: [
          { title: 'Merchants', type: 'basic', link: '/merchants' },
          { title: 'Users', type: 'basic', link: '/users' },
          { title: 'Drivers', type: 'basic', link: '/drivers' },
        ],
    },
    {
        title: 'Access Control',
        type: 'collapsable',
        children: [
          { title: 'Roles', type: 'basic', link: '/roles' },
          //{ title: 'Groups', type: 'basic', link: '/groups' },
          { title: 'Privilege Management', type: 'basic', link: '/privileges' },
        ],
    },
    { 
        title: 'Reports', 
        type: 'collapsable',
        children: [
            { title: 'User Report', type: 'basic', link: '/userreport' },
            { title: 'Merchant Report', type: 'basic', link: '/merchantreport' },
            { title: 'Driver Report', type: 'basic', link: '/driverreport' },
            { title: 'Orders Report', type: 'basic', link: '/ordersreport' },   
            { title: 'Products Report', type: 'basic', link: '/productsreport' }, 
        ],
    },
    {
      title: 'Configuration',
      type: 'collapsable',
      children: [      
        { title: 'Payment Method', type: 'basic', link: '/paymentmethod' },
        { title: 'Email Templates', type: 'basic', link: '/emailtemplates' },
        //{ title: 'SMS Templates', type: 'basic', link: '/smstemplates' },
      ],
  },
    { 
        title: 'Settings', 
        type: 'collapsable',
        children: [
            { title: 'Global Settings', type: 'basic', link: '/globalsettings' },
            { title: 'Application Notification', type: 'basic', link: '/applicationnotification' },
            { title: 'Currency', type: 'basic', link: '/currency' },
        ],
    },
    { title: 'FAQ', type: 'basic', link: '/faq' },
  ]);
  

  export const compactNavigation: FuseNavigationItem[] = applyConfig([
    {
      title: 'Dashboard',
      type: 'basic',
      link: '/dashboard',
    },
    {
      title: 'Masters',
      type: 'collapsable',
      children: [
        { title: 'Countries', type: 'basic', link: '/countries' },
        { title: 'Type', type: 'basic', link: '/type' },
        { title: 'Brand', type: 'basic', link: '/brand' },
        { title: 'Banners', type: 'basic', link: '/banners' },
        { title: 'Length', type: 'basic', link: '/length' },
        { title: 'Fabric', type: 'basic', link: '/fabric' },
        { title: 'Size', type: 'basic', link: '/size' },
        { title: 'Color', type: 'basic', link: '/color' },
        { title: 'Care', type: 'basic', link: '/care' },
      ],
    },
    {
      title: 'Inventory',
      type: 'collapsable',
      children: [
        { title: 'Categories', type: 'basic', link: '/categories' },
        { title: 'Products', type: 'basic', link: '/products' },
        { title: 'Promo Code', type: 'basic', link: '/promocode' },
      ],
    },
    {
        title: 'Tailoring Services',
        type: 'basic',
        link:'/services'
    },    
    { title: 'Page Management', type: 'basic', link: '/pages' },
    { 
        title: 'Transactions', 
        type: 'collapsable',
        children: [
            { title: 'All Orders', type: 'basic', link: '/transactions/all' },
            { title: 'Payment History', type: 'basic', link: '/transactions/history' },
            { title: 'Invoices', type: 'basic', link: '/transactions/invoices' }, 
        ],
    },
    {
        title: 'Configuration',
        type: 'collapsable',
        children: [
          { title: 'SMS', type: 'basic', link: '/sms' },
          { title: 'Payment Gateway', type: 'basic', link: '/payment' },
          { title: 'Currency', type: 'basic', link: '/currency' },
          { title: 'Language', type: 'basic', link: '/language' },
          { title: 'Email Templates', type: 'basic', link: '/email-templates' },
          { title: 'SMS Templates', type: 'basic', link: '/sms-templates' },
        ],
    },
    {
        title: 'Accounts',
        type: 'collapsable',
        children: [
          { title: 'Merchants', type: 'basic', link: '/merchants' },
          { title: 'Users', type: 'basic', link: '/users' },
          { title: 'Drivers', type: 'basic', link: '/drivers' },
        ],
    },
    {
        title: 'Access Control',
        type: 'collapsable',
        children: [
          { title: 'Roles', type: 'basic', link: '/roles' },
          { title: 'Groups', type: 'basic', link: '/groups' },
          { title: 'Privilege Management', type: 'basic', link: '/privileges' },
        ],
    },
    { 
        title: 'Reports', 
        type: 'collapsable',
        children: [
            { title: 'User Report', type: 'basic', link: '/sms' },
            { title: 'Merchant Report', type: 'basic', link: '/payment' },
            { title: 'Driver Report', type: 'basic', link: '/currency' },
            { title: 'Orders Report', type: 'basic', link: '/language' },   
            { title: 'Products Report', type: 'basic', link: '/language' }, 
        ],
    },
    { 
        title: 'Settings', 
        type: 'collapsable',
        children: [
            { title: 'Global Settings', type: 'basic', link: '/sms' },
            { title: 'Application Notification', type: 'basic', link: '/payment' },
            { title: 'Message Center', type: 'basic', link: '/currency' },
        ],
    },
    { title: 'FAQ', type: 'basic', link: '/faq' },
  ]);

  export const futuristicNavigation: FuseNavigationItem[] = applyConfig([
    {
      title: 'Dashboard',
      type: 'basic',
      link: '/dashboard',
    },
    {
      title: 'Masters',
      type: 'collapsable',
      children: [
        { title: 'Countries', type: 'basic', link: '/countries' },
        { title: 'Type', type: 'basic', link: '/type' },
        { title: 'Brand', type: 'basic', link: '/brand' },
        { title: 'Banners', type: 'basic', link: '/banners' },
        { title: 'Length', type: 'basic', link: '/length' },
        { title: 'Fabric', type: 'basic', link: '/fabric' },
        { title: 'Size', type: 'basic', link: '/size' },
        { title: 'Color', type: 'basic', link: '/color' },
        { title: 'Care', type: 'basic', link: '/care' },
      ],
    },
    {
      title: 'Inventory',
      type: 'collapsable',
      children: [
        { title: 'Categories', type: 'basic', link: '/categories' },
        { title: 'Products', type: 'basic', link: '/products' },
        { title: 'Promo Code', type: 'basic', link: '/promocode' },
      ],
    },
    {
        title: 'Tailoring Services',
        type: 'basic',
        link:'/services'
    },    
    { title: 'Page Management', type: 'basic', link: '/pages' },
    { 
        title: 'Transactions', 
        type: 'collapsable',
        children: [
            { title: 'All Orders', type: 'basic', link: '/transactions/all' },
            { title: 'Payment History', type: 'basic', link: '/transactions/history' },
            { title: 'Invoices', type: 'basic', link: '/transactions/invoices' }, 
        ],
    },
    {
        title: 'Configuration',
        type: 'collapsable',
        children: [
          { title: 'SMS', type: 'basic', link: '/sms' },
          { title: 'Payment Gateway', type: 'basic', link: '/payment' },
          { title: 'Currency', type: 'basic', link: '/currency' },
          { title: 'Language', type: 'basic', link: '/language' },
          { title: 'Email Templates', type: 'basic', link: '/email-templates' },
          { title: 'SMS Templates', type: 'basic', link: '/sms-templates' },
        ],
    },
    {
        title: 'Accounts',
        type: 'collapsable',
        children: [
          { title: 'Merchants', type: 'basic', link: '/merchants' },
          { title: 'Users', type: 'basic', link: '/users' },
          { title: 'Drivers', type: 'basic', link: '/drivers' },
        ],
    },
    {
        title: 'Access Control',
        type: 'collapsable',
        children: [
          { title: 'Roles', type: 'basic', link: '/roles' },
          { title: 'Groups', type: 'basic', link: '/groups' },
          { title: 'Privilege Management', type: 'basic', link: '/privileges' },
        ],
    },
    { 
        title: 'Reports', 
        type: 'collapsable',
        children: [
            { title: 'User Report', type: 'basic', link: '/sms' },
            { title: 'Merchant Report', type: 'basic', link: '/payment' },
            { title: 'Driver Report', type: 'basic', link: '/currency' },
            { title: 'Orders Report', type: 'basic', link: '/language' },   
            { title: 'Products Report', type: 'basic', link: '/language' }, 
        ],
    },
    { 
        title: 'Settings', 
        type: 'collapsable',
        children: [
            { title: 'Global Settings', type: 'basic', link: '/sms' },
            { title: 'Application Notification', type: 'basic', link: '/payment' },
            { title: 'Message Center', type: 'basic', link: '/currency' },
        ],
    },
    { title: 'FAQ', type: 'basic', link: '/faq' },
  ]);

  export const horizontalNavigation: FuseNavigationItem[] = applyConfig([
    {
      title: 'Dashboard',
      type: 'basic',
      link: '/dashboard',
    },
    {
      title: 'Masters',
      type: 'collapsable',
      children: [
        { title: 'Countries', type: 'basic', link: '/countries' },
        { title: 'Type', type: 'basic', link: '/type' },
        { title: 'Brand', type: 'basic', link: '/brand' },
        { title: 'Banners', type: 'basic', link: '/banners' },
        { title: 'Length', type: 'basic', link: '/length' },
        { title: 'Fabric', type: 'basic', link: '/fabric' },
        { title: 'Size', type: 'basic', link: '/size' },
        { title: 'Color', type: 'basic', link: '/color' },
        { title: 'Care', type: 'basic', link: '/care' },
      ],
    },
    {
      title: 'Inventory',
      type: 'collapsable',
      children: [
        { title: 'Categories', type: 'basic', link: '/categories' },
        { title: 'Products', type: 'basic', link: '/products' },
        { title: 'Promo Code', type: 'basic', link: '/promocode' },
      ],
    },
    {
        title: 'Tailoring Services',
        type: 'basic',
        link:'/services'
    },    
    { title: 'Page Management', type: 'basic', link: '/pages' },
    { 
        title: 'Transactions', 
        type: 'collapsable',
        children: [
            { title: 'All Orders', type: 'basic', link: '/transactions/all' },
            { title: 'Payment History', type: 'basic', link: '/transactions/history' },
            { title: 'Invoices', type: 'basic', link: '/transactions/invoices' }, 
        ],
    },
    {
        title: 'Configuration',
        type: 'collapsable',
        children: [
          { title: 'SMS', type: 'basic', link: '/sms' },
          { title: 'Payment Gateway', type: 'basic', link: '/payment' },
          { title: 'Currency', type: 'basic', link: '/currency' },
          { title: 'Language', type: 'basic', link: '/language' },
          { title: 'Email Templates', type: 'basic', link: '/email-templates' },
          { title: 'SMS Templates', type: 'basic', link: '/sms-templates' },
        ],
    },
    {
        title: 'Accounts',
        type: 'collapsable',
        children: [
          { title: 'Merchants', type: 'basic', link: '/merchants' },
          { title: 'Users', type: 'basic', link: '/users' },
          { title: 'Drivers', type: 'basic', link: '/drivers' },
        ],
    },
    {
        title: 'Access Control',
        type: 'collapsable',
        children: [
          { title: 'Roles', type: 'basic', link: '/roles' },
          { title: 'Groups', type: 'basic', link: '/groups' },
          { title: 'Privilege Management', type: 'basic', link: '/privileges' },
        ],
    },
    { 
        title: 'Reports', 
        type: 'collapsable',
        children: [
            { title: 'User Report', type: 'basic', link: '/sms' },
            { title: 'Merchant Report', type: 'basic', link: '/payment' },
            { title: 'Driver Report', type: 'basic', link: '/currency' },
            { title: 'Orders Report', type: 'basic', link: '/language' },   
            { title: 'Products Report', type: 'basic', link: '/language' }, 
        ],
    },
    { 
        title: 'Settings', 
        type: 'collapsable',
        children: [
            { title: 'Global Settings', type: 'basic', link: '/sms' },
            { title: 'Application Notification', type: 'basic', link: '/payment' },
            { title: 'Message Center', type: 'basic', link: '/currency' },
        ],
    },
    { title: 'FAQ', type: 'basic', link: '/faq' },
  ]);


