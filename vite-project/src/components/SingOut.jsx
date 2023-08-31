import { useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import auth from '../auth';
 
const SingOut = () => {
 
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              const uid = user.uid;
            }
          });
         
    }, [])
 
  return (
    <section>        
    
    </section>
  )
}
 
export default SingOut
