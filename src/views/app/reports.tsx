import React from 'react';
import { Row } from 'reactstrap';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import { useLocation } from 'react-router-dom';

const BlankPage = () => {
  const match = useLocation();

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.reports" match={match}/>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-4">
          <p>
            <IntlMessages id="menu.reports" />
          </p>
        </Colxx>
      </Row>
    </>
  );
};

export default BlankPage;