import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
    return() => import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "IndexPage",
            meta: {title: 'Atma Jaya Rental'},
            component: importComponent("IndexPage"),
        },
        {
            path: "/login",
            name: "LoginPage",
            meta: {title: 'Login Page'},
            component: importComponent("LoginPage"),
        },
        {
            path: "/register",
            name: "RegisterPage",
            meta: {title: 'Register Page'},
            component: importComponent("RegisterPage"),
        },
        {
            path: "/manager",
            name: "ManagerPage",
            meta: {requiresAuth:true}, 
            component: importComponent("Manager/DashboardManager"),
            beforeEnter(to, from, next){
                if(localStorage.getItem('idRole') == 'MGR'){
                    next();
                }else{
                    alert('No access To This Page!'),
                    next('/');
                }
                
                next();
            },
            children:[
                {
                    path: "/dashboardManager",
                    name: "DashboardManager",
                    meta: {requiresAuth:true}, 
                    component: importComponent(""),
                },
                {
                    path: "/myProfileManager",
                    name: "EmployeeProfile",
                    meta: {requiresAuth:true}, 
                    component: importComponent("Manager/ManagerProfile"),
                },
                {
                    path: "/tableShift",
                    name: "DataShift",
                    meta: {requiresAuth:true}, 
                    component: importComponent("Manager/DataShift"),
                },
                {
                    path: "/tablePromo",
                    name: "DataPromo",
                    meta: {requiresAuth:true}, 
                    component: importComponent("Manager/DataPromo"),
                },
            ]
        },
        {
            path: "/cs",
            name: "CSPage",
            meta: {requiresAuth:true}, 
            component: importComponent("CS/DashboardCs"),
            beforeEnter(to, from, next){
                if(localStorage.getItem('idRole') == 'CSV'){
                    next();
                }else{
                    alert('No access To This Page!'),
                    next('/');
                }
                
                next();
            },
            children:[
                {
                    path: "/dashboardCs",
                    name: "DashboardCS",
                    meta: {requiresAuth:true}, 
                    component: importComponent(""),
                },
                {
                    path: "/myProfileCs",
                    name: "EmployeeProfile",
                    meta: {requiresAuth:true}, 
                    component: importComponent("EmployeeProfile"),
                },
                {
                    path: "/tableCust",
                    name: "Data Customer",
                    meta: {requiresAuth:true}, 
                    component: importComponent("CS/DataCustomer"),
                },
                {
                    path: "/tableTransaction",
                    name: "Data Transaction",
                    meta: {requiresAuth:true}, 
                    component: importComponent("CS/DataTransaction"),
                },
            ]
        },
        {
            path: "/admin",
            name: "AdminPage",
            meta: {requiresAuth:true}, 
            component: importComponent("Administrator/DashboardAdmin"),
            beforeEnter(to, from, next){
                if(localStorage.getItem('idRole') == 'ADM'){
                    next();
                }else{
                    alert('No access To This Page!'),
                    next('/');
                }
                
                next();
            },
            children:[
                {
                    path: "/dashboardAdmin",
                    name: "DashboardAdmin",
                    meta: {requiresAuth:true}, 
                    component: importComponent(""),
                },
                {
                    path: "/myProfileAdmin",
                    name: "EmployeeProfile",
                    meta: {requiresAuth:true}, 
                    component: importComponent("EmployeeProfile"),
                },
                {
                    path: "/tableEmployee",
                    name: "Data Employee",
                    meta: {requiresAuth:true}, 
                    component: importComponent("Administrator/DataEmployee"),
                },
                {
                    path: "/tableCar",
                    name: "Data Car",
                    meta: {requiresAuth:true}, 
                    component: importComponent("Administrator/DataCar"),
                },
                {
                    path: "/tablePartner",
                    name: "Data Partner",
                    meta: {requiresAuth:true}, 
                    component: importComponent("Administrator/DataPartner"),
                },
            ]
        },
        {
            path: "/customer",
            name: "CustomerPage",
            meta: [
                {title: 'Atma Jaya Rental'}, 
                {requiresAuth:true}
            ], 
            component: importComponent("Customer/DashboardCustomer"),
            children:[
                {
                    path: "/listPromo",
                    name: "ListPromo",
                    meta: {requiresAuth:true}, 
                    component: importComponent("Customer/ListPromo"),
                },
                {
                    path: "/myTransaction",
                    name: "TransactionPage",
                    meta: {requiresAuth:true}, 
                    component: importComponent("Customer/TransactionPage"),
                },
                {
                    path: "/myProfileCust",
                    name: "CustomerProfile",
                    meta: {requiresAuth:true}, 
                    component: importComponent("Customer/CustomerProfile"),
                },
                {
                    path: "/listcar",
                    name: "ListCar",
                    meta: {requiresAuth:true}, 
                    component: importComponent("Customer/ListCar"),
                },
            ]
        },
    ],
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});

export default router;