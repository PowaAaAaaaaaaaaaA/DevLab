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
        path:'/Lessons',
        icon:<IoLibraryOutline />
    },{
        key:'achievements',
        label:'Achievements',
        path:'/Achievements',
        icon:<IoTrophyOutline />
    },{
        key:'shop',
        label:'Shop',
        path:'/Shop',
        icon:<IoCartOutline />
    },{
        key:'coding',
        label:'Coding Playground',
        path:'/codingPlay',
        icon:<IoCodeSlash />
    },{
        key:'data',
        label:'Database Playground',
        path:'/dataPlayground',
        icon:<IoLayersOutline />

    },
]