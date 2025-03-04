import { configureStore } from "@reduxjs/toolkit";
import employeesReducer from "./reducers/employeesReducer";
import positionsReducer from "./reducers/positionReducer";
import departmentsReducer from "./reducers/departmentsReducer";
import authReducer from "./reducers/authReducer";

const store = configureStore({
    reducer: {
        employees: employeesReducer,
        positions: positionsReducer,
        departments: departmentsReducer,
        auth: authReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
