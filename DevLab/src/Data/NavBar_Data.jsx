import { IoHomeOutline, 
        IoLibraryOutline,
        IoTrophyOutline,
        IoCartOutline,
        IoCodeSlash,
        IoLayersOutline 


 } from "react-icons/io5";


export const Navbar_Data=[
    {
        key:'dashboard',
        label:'Dashbaord',
        path:'/Main',
        icon:<IoHomeOutline />
    },{
        key:'lessons',
        label:'Lessons',
        path:'/Main/Lessons',
        icon:<IoLibraryOutline />
    },{
        key:'achievements',
        label:'Achievements',
        path:'/Main/Achievements',
        icon:<IoTrophyOutline />
    },{
        key:'shop',
        label:'Shop',
        path:'/Main/Shop',
        icon:<IoCartOutline />
    },{
        key:'coding',
        label:'Coding Playground',
        path:'/codingPlay',
        icon:<IoCodeSlash />
    },{
        key:'data',
        label:'Database Playground',
        path:'/Main/dataPlayground',
        icon:<IoLayersOutline />

    },
]