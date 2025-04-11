import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"
import {useNavigate} from 'react-router-dom'

function MyAppointments() {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)

  const [aayushmanIds, setAayushmanIds] = useState({})

  const [appointments, setAppointments] = useState([])
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const navigate = useNavigate()

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  // Getting User Appointments Data Using API
  const getUserAppointments = async () => {
    try {

        const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
        setAppointments(data.appointments.reverse())

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}

  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId) => {
      try {

        // console.log(appointmentId);
        
          const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

          if (data.success) {
              toast.success(data.message)
              getUserAppointments()
              getDoctorsData()
          } else {
              toast.error(data.message)
          }

      } catch (error) {
          console.log(error)
          toast.error(error.message)
      }

  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID ,
      amount: order.amount,
      currency: order.currency,
      name:'Appointment Payment',
      description:'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        
        try {
          const {data} = await axios.post(backendUrl+'/api/user/verifyRazorpay', response, {headers:{token}})
          if(data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const {data} = await axios.post(backendUrl+'/api/user/payment-razorpay', {appointmentId}, {headers:{token}})

      if(data.success) {
        initPay(data.order)
        
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const verifyAayushman = async (appointmentId, aayushmanId) => {
    try {
      console.log("VERIFYING", { appointmentId, aayushmanId })
      const { data } = await axios.post(backendUrl+'/api/user/verify-aayushman',
        { appointmentId, aayushmanId },
        { headers: { token } }
      );
  
      if (data.success) {
        toast.success("Verified via Aayushman");
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };
  


  useEffect(()=>{
    if(token) {
      getUserAppointments()
    }
  },[token])

  return (
    <div>
      <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My Appointments</p>
      <div>
        {appointments.map((item, index)=>(
          <div key={index}  className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
            <div>
              <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-[#5E5E5E]'>
              <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-[#464646] font-medium mt-1'>Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time: </span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end text-sm text-center'>
              {!item.cancelled && item.payment && !item.isCompleted && <button className="sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]">Paid</button>}
              {!item.cancelled && !item.isCompleted && !item.payment && <button onClick={() => appointmentRazorpay(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
              {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
              {item.cancelled && !item.isCompleted && <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">Appointment Cancelled</button>}
              {item.isCompleted && <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">Completed</button>}
              {!item.cancelled && !item.isCompleted && !item.payment 
              && <input
                type="text"
                placeholder="Enter Aayushman ID"
                value={aayushmanIds[item._id] || ""}
                onChange={(e) =>
                  setAayushmanIds((prev) => ({ ...prev, [item._id]: e.target.value }))
                }
                className="mt-2 px-3 py-1 border rounded text-xs"
              />}

            {!item.cancelled && !item.isCompleted && !item.payment && 
              <button
              onClick={() => verifyAayushman(item._id, aayushmanIds[item._id])}
              className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-green-500 hover:text-white transition-all duration-300'
              >
              Verify Aayushman
            </button>}

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments