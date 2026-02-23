import StatusSection from './status-section';
import DestinationStoreInformation from './destination-store-information';
import BasicInformationSection from './basic-information-section';
import AssessmentDatesSection from './assessment-dates-section';
import VehicleSection from './vehicle-section';
import ExteriorConditionSection from './exterior-condition-sectiion';
import InteriorConditionSection from './interior-condition-section';
import CarAccessoriesSection from './car-accessories-section';

function AssessmentRequestDetailsLayout(props: any) {

  return (
    <div style={{ padding: '5%' }}>
      <StatusSection data={props.data} />
      {/* <DestinationStoreInformation data={props.data} /> */}
      <BasicInformationSection data={props.data} />
      <AssessmentDatesSection data={props.data} />
      <VehicleSection data={props.data} />
      <ExteriorConditionSection data={props.data} />
      <InteriorConditionSection data={props.data} />
      <CarAccessoriesSection data={props.data} />
    </div>
  );
}

export default AssessmentRequestDetailsLayout;
