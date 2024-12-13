import React, {useState} from 'react';
import './footer.scss';
import {service} from '@/service'
const PageFooter = () => {

  const [version, setVersion] = useState('');

  service.root().then(res => {
    setVersion(res.data.version)
  })

  return (
    <div className='page-footer'>
      <div className='proj-name'>
        选课系统
      </div>
      <div>
        版本  | {version}
      </div>
    </div>
  );
}

export default PageFooter;