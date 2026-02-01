'use client';

import { useState } from 'react';

interface Image {
    id: string;
    url: string;
    alt?: string | null;
}

export default function Gallery({ images, productName }: { images: Image[], productName: string }) {

    const [mainImage, setMainImage] = useState(images[0]?.url || '');

    if (images.length === 0) return <div className="no-image">No images available</div>;

    return (
        <div className="image-gallery">

            <div className="main-image-container" style={{ marginBottom: '1rem' }}>
                <img
                    src={mainImage}
                    alt={productName}
                    style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        aspectRatio: '1/1',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                />
            </div>


            <div className="thumbnails-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '10px'
            }}>
                {images.map((img) => (
                    <img
                        key={img.id}
                        src={img.url}
                        alt={img.alt || productName}
                        onClick={() => setMainImage(img.url)}
                        style={{
                            width: '100%',
                            height: '80px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            objectFit: 'cover',
                            border: mainImage === img.url ? '2px solid #000' : '2px solid transparent',
                            transition: 'border 0.2s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}