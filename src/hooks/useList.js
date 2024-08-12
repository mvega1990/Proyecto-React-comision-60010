import { useEffect, useState } from "react";

export const useList = param => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      new Promise((res) => {
        setTimeout(() => res(param), 3000);
      }).then((respuesta) => {
        setList(respuesta);
      }).finally(() => setLoading(false));
    }, [param]);
  
    return {list , loading }
}
    