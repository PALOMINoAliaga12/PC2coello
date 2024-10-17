import moment from 'moment';

export const formatDate = (date) => {
    return moment(date).isValid() ? moment(date).utc().format('YYYY-MM-DD') : '';
};
