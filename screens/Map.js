import Exponent, { Components } from 'exponent';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  ActivityIndicator,
} from 'react-native';
import gql from 'graphql-tag';

class Map extends React.Component {
  static route = {
    navigationBar: {
      title: 'MAP',
      renderRight: (route, props) => <Button
        title="Logout"
        color="#3B3738"
        onPress={() => {
          // this.props.navigator.push('home');
          console.log(route,props);
        }}
      />,
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  componentWillMount() {
    const { Location, Permissions } = Exponent;
    Permissions.askAsync(Permissions.LOCATION)
    .then((response) => {
      const { status } = response;
      if (status === 'granted') {
        Location.getCurrentPositionAsync({ enableHighAccuracy: true })
        .then((location) => {
          this.setState({
            region: {
              ...this.state.region,
              ...location.coords,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.data);
  }

  render() {
    if (this.props.data.loading) {
      return (
        <ActivityIndicator
          size="large"
          color="#843131"
        />
      );
    }
    return (
      <Components.MapView
        style={{ flex: 1 }}
        region={this.state.region}
      >
        <Components.MapView.Marker
          coordinate={{
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
          }}
          title="Username"
          description="This will be some post text."
        />
      </Components.MapView>
    );
  }
}


const mapQueriesToProps = ({ ownProps, state }) => {
  return {
    data: {
      query: gql`
        query {
          User(email: ${state.user.email}, id: ${state.user.id}) {
            firstName,
            lastName
          }
        }
      `,
    },
  };
};

export default connect({
  mapQueriesToProps,
})(Map);
