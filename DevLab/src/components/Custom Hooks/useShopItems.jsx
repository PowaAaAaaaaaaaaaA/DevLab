import { useEffect, useState } from "react";
import { db } from "../../Firebase/Firebase";
import { getDocs, collection } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";

export default function useShopItems(){

    
    const fetchItems = async() => {
        try{
            const shopDb = collection(db, "Shop");
            const shopData = await getDocs(shopDb);

            const itemList = shopData.docs.map(doc =>({
                id: doc.id,
                ...doc.data()
            }))

            return itemList;
        }catch(errror){
            console.log(errror)
        }
    }
    const {data: items, isLoading: loading} = useQuery({
        queryKey: ["Items_Details"],
        queryFn: fetchItems,
    });

return{items, loading}
}