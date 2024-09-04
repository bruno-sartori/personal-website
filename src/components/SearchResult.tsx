import { isValidString } from '@/isValidVariable';
import { UIOptions } from '@/types';
import Image, { ImageLoaderProps } from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface SearchResultProps {
  result: any;
  uiOptions: UIOptions;
}

const imageLoader = ({ src }: ImageLoaderProps) => {
  return src;
}

const SearchResult = ({ result, uiOptions }: SearchResultProps) => {
  const [data, setData] = useState<any>(null);

  React.useEffect(() => {
    async function fetchData() {
      const data = await result.data();
      console.log(data)
      setData(data);
    }
    
    fetchData();
  }, [result]);

  if (!data) return null;

  return (
    <li className="p-2 border-b last:border-none">
      <Link href={data.raw_url?.replace('/server/app', '').replace('.html', '')}>
      <div className="flex items-start">
        {uiOptions?.showImages && isValidString(data.meta.image) && (
          <Image loader={imageLoader} src={data.meta.image} width={120} height={67} alt={data.meta.title} className="mr-5 self-center hidden lg:block md:block" />
        )}
        <div>
          <div className="font-bold">{data.meta.title}</div>
          <div className="text-sm text-ellipsis" dangerouslySetInnerHTML={{__html: data.excerpt?.slice(0, uiOptions?.excerptLength || 100) }} />
        </div>
      </div>
      </Link>
    </li>
  );
}

export default SearchResult;
