import { IoHomeOutline, 
        IoLibraryOutline,
        IoTrophyOutline,
        IoCartOutline,
        IoCodeSlash,
        IoLayersOutline,
        IoLogoCss3,
        IoLogoHtml5,
        IoLogoJavascript,
        IoServer

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
    { key: 'html', label: 'Html', path: '/Main/Lessons/Html', icon:<IoLogoHtml5 /> },
    { key: 'css', label: 'Css', path: '/Main/Lessons/Css' , icon:<IoLogoCss3 />},
    { key: 'js', label: 'JavaScript', path: '/Main/Lessons/JavaScript', icon:<IoLogoJavascript /> },
    { key: 'db', label: 'Database', path: '/Main/Lessons/Database', icon:<IoServer /> }
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