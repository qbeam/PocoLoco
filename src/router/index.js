import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import EmployeeReg from "../views/EmployeeReg.vue";
import CustomerReg from "../views/CustomerReg.vue";
import AddRole from "../views/AddRole.vue";
import AddPromo from "../views/AddPromo.vue";
import AddBooking from "../views/AddBooking.vue";
import AddBookingDetail from "../views/AddBookingDetail.vue";
import Role from "../views/Role.vue";
import AddExpense from "../views/AddExpense.vue";
import AddNewService from "../views/AddNewService.vue";
import Customer from "../views/Customer.vue";
import Booking from "../views/Booking.vue";
import HotelExpenses from "../views/HotelExpenses.vue";
import Promotion from "../views/Promotion.vue";
import Room from "../views/Room.vue";
import Services from "../views/Services.vue";
import Employee from "../views/Employee.vue";
import BusinessAnalysis from "../views/BusinessAnalysis.vue";

const routes = [
  {
    path: "/Home",
    name: "Home",
    component: Home,
  },
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/EmployeeReg",
    name: "EmployeeReg",
    component: EmployeeReg,
  },
  {
    path: "/Employee",
    name: "Employee",
    component: Employee,
  },
  {
    path: "/CustomerReg",
    name: "CustomerReg",
    component: CustomerReg,
  },
  {
    path: "/Customer",
    name: "Customer",
    component: Customer,
  },
  {
    path: "/AddRole",
    name: "AddRole",
    component: AddRole,
  },
  {
    path: "/Role",
    name: "Role",
    component: Role,
  },
  {
    path: "/AddPromo",
    name: "AddPromo",
    component: AddPromo,
  },
  {
    path: "/Booking",
    name: "Booking",
    component: Booking,
  },
  {
    path: "/AddBooking",
    name: "AddBooking",
    component: AddBooking,
  },
  {
    path: "/AddBookingDetail",
    name: "AddBookingDetail",
    component: AddBookingDetail,
  },
  {
    path: "/AddExpense",
    name: "AddExpense",
    component: AddExpense,
  },
  {
    path: "/AddNewService",
    name: "AddNewService",
    component: AddNewService,
  },
  {
    path: "/HotelExpenses",
    name: "HotelExpenses",
    component: HotelExpenses,
  },
  {
    path: "/Promotion",
    name: "Promotion",
    component: Promotion,
  },
  {
    path: "/Room",
    name: "Room",
    component: Room,
  },
  {
    path: "/Services",
    name: "Services",
    component: Services,
  },
  {
    path: "/BusinessAnalysis",
    name: "BusinessAnalysis",
    component: BusinessAnalysis,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
