
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const SSE_URL = 'http://185.126.203.246:3001/api/v1/cart/updates';

export function useCartCount() {
    const [count, setCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const customerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);

    useEffect(() => {
        if (!customerId) {
            setCount(0);
            setIsConnected(false);
            return;
        }

       
        const url = `${SSE_URL}?chadcoCustomerId=${customerId}`;
        const eventSource = new EventSource(url);

        eventSource.onopen = () => {
          
            setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
            try {

                const data = JSON.parse(event.data);


                // Handle heartbeat
                if (data.type === 'heartbeat') {
                    
                    return;
                }

                // Handle cart update
                if (data.itemCount !== undefined) {

                    setCount(data.itemCount);
                } else if (data.items && Array.isArray(data.items)) {

                    setCount(data.items.length);
                }
            } catch (error) {

            }
        };

        eventSource.onerror = (error) => {
            
            setIsConnected(false);
        };

        // Cleanup
        return () => {
           
            eventSource.close();
        };
    }, [customerId]);

    return { count, isConnected };
}

