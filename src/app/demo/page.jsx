
// "use client"
// import React, { useEffect } from 'react'

async function page() {


    const fetchdata = async () => {
        try {

            const resp = await fetch("https://jsonplaceholder.typicode.com/users");
            const data = await resp.json();
            console.log("dara", data);
            return data;

        } catch (error) {
            console.log("error", error);
        }

    }

    const ans =await fetchdata();
    console.log("ans",ans);


    // useEffect(()=>{
    //     fetchdata();
    // },[])

    return (
        <div className="w-full flex flex-wrap gap-6">
        {
            ans?.map((item)=>(
                <div key={item.id} className="border border-black p-4">
                     <p> {item.name}</p>
                      <p>{item?.email}</p>
                      <p>{item?.address?.city}</p>
                </div>
            ))
        }
        </div>
    )
}

export default page
