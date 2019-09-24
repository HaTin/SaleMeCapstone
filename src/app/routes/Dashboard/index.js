import React from 'react';
import ContainerHeader from 'components/ContainerHeader';
import IconWithTextCard from "./IconWithTextCard";
import CardBox from 'components/CardBox';
import PieChartWithLabel from './PieChartWithLabel';
import IntlMessages from 'util/IntlMessages';
import { detailCards } from "./data";
class Dashboard extends React.Component {

    render() {
        return (
            <div className="app-wrapper">
                <ContainerHeader match={this.props.match} title={<IntlMessages id="dashboard" />} />
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                        <div className="row">
                            {detailCards.map((data, index) => <div key={index} className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6">
                                <IconWithTextCard data={data} />
                            </div>)
                            }
                        </div>
                        <div className="row">
                            <CardBox heading="Bot Statistic">                                
                                <PieChartWithLabel />
                            </CardBox>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default Dashboard;