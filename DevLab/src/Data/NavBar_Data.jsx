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
        path:'/Main/Lessons/Html',
        icon:<IoLibraryOutline />,
        children: [
    { key: 'html', label: 'HTML', path: '/Main/Lessons/Html', icon:<IoLibraryOutline /> },
    { key: 'css', label: 'CSS', path: '/Main/Lessons/Css' , icon:<IoLibraryOutline />},
    { key: 'js', label: 'JavaScript', path: '/Main/Lessons/JavaScript', icon:<IoLibraryOutline /> },
    { key: 'db', label: 'Database', path: '/Main/Lessons/DataBase', icon:<IoLibraryOutline /> }
    ]
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
        path:'/dataPlayground',
        icon:<IoLayersOutline />

    },
]