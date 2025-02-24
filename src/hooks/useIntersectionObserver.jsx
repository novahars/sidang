import { useEffect, useState } from 'react';

export default function useIntersectionObserver(refs, options) {
    const [visibleElements, setVisibleElements] = useState([]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter(entry => entry.isIntersecting && entry.intersectionRatio >= 0.5)
                .map(entry => entry.target.dataset.comkey);
            setVisibleElements(visible);
        }, options);

        refs.current.forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            refs.current.forEach(ref => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, [refs, options]);

    return visibleElements;
}
