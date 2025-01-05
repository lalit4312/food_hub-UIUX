// import React, { useEffect, useState } from 'react'
// import './List.css'
// import axios from 'axios'
// import { toast } from 'react-toastify';

// const List = ({url}) => {

//   const [list, setList] = useState([]);

//   const fetchList = async () =>{
//     const response = await axios.get(`${url}/api/food/list`)
   
//     if(response.data.success){
//       setList(response.data.data)
//     }
//     else{
//       toast.error("Error")
//     }
//   }

//   const removeFood = async (foodId) =>{
//     const response = await axios.post(`${url}/api/food/remove`,{id:foodId})
//     await fetchList();
//     if(response.data.success){
//       toast.success(response.data.message)
//     }else{
//       toast.error('Error');
//     }
//   }

//   useEffect(()=>{
//     fetchList();
//   },[])
//   return (
//     <div className='list add flex-col'>
//       <p>All Foods List</p>
//       <div className="list-table">
//         <div className="list-table-format title">
//             <b>Image</b>
//             <b>Name</b>
//             <b>Category</b>
//             <b>Price</b>
//             <b>Action</b>
//         </div>
//         {list.map((item,index)=>{
//           return(
//             <div key={index} className="list-table-format">
//               <img src={`${url}/images/`+item.image} alt="" />
//               <p>{item.name}</p>
//               <p>{item.category}</p>
//               <p>NPR {item.price}</p>
//               <p onClick={()=> removeFood(item._id)} className='cursor'>X</p>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default List

import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrashAlt, FaSearch } from 'react-icons/fa';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food items");
      }
    } catch (error) {
      toast.error("Failed to fetch food items");
    }
  };

  const removeFood = async (foodId, foodName) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        await fetchList();
        toast.success(`${foodName} has been removed successfully`);
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  const filteredList = list.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list-container'>
      <div className='list-header'>
        <h2>Food Items Management</h2>
        <div className='search-bar'>
          <FaSearch className='search-icon' />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="list-table">
        <div className="list-table-header">
          <div className="header-cell">Image</div>
          <div className="header-cell">Name</div>
          <div className="header-cell">Category</div>
          <div className="header-cell">Price</div>
          <div className="header-cell">Action</div>
        </div>

        <div className="list-table-body">
          {filteredList.map((item, index) => (
            <div key={index} className="list-table-row">
              <div className="table-cell">
                <img src={`${url}/images/${item.image}`} alt={item.name} className="food-image" />
              </div>
              <div className="table-cell">
                <span className="food-name">{item.name}</span>
              </div>
              <div className="table-cell">
                <span className="category-badge">{item.category}</span>
              </div>
              <div className="table-cell">
                <span className="price">NPR {item.price}</span>
              </div>
              <div className="table-cell">
                <button
                  className="delete-btn"
                  onClick={() => removeFood(item._id, item.name)}
                  title="Delete item"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredList.length === 0 && (
        <div className="no-items">
          <p>No food items found</p>
        </div>
      )}
    </div>
  );
};

export default List;