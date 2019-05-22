
import * as React from 'react';
import styles from './ReactCrud.module.scss';
import { IReactCrudProps } from './IReactCrudProps';
import { IReactCrudState } from './IReactCrudState';
import { IListItem } from './IListItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import {  CardTitle, CardBody, Card, CardImg, CardText, CardFooter, CardDeck, CardSubtitle  } from "reactstrap";
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { getReactSelector } from 'react-selectors';

export default class ReactCrud extends React.Component<IReactCrudProps, IReactCrudState> {

  private listItemEntityTypeName: string = undefined;

  constructor(props: IReactCrudProps, state: IReactCrudState) {
    super(props);

    this.state = {
      status: this.listNotConfigured(this.props) ? 'Please configure list in Web Part properties' : 'Ready',
      items: []
    };
  }

  public componentWillReceiveProps(nextProps: IReactCrudProps): void {
    this.listItemEntityTypeName = undefined;
    this.setState({
      status: this.listNotConfigured(nextProps) ? 'Please configure list in Web Part properties' : 'Ready',
      items: []
    });
  }

public componentWillMount () {  
  {this.readItems();}
}

public _renderCurrencies(imgitem) {
    var img = document.createElement('div');
    img.innerHTML = imgitem;//'<div class="ExternalClass2A0229C54EBC4387B26BC8B914275E77"><img src="/sites/CyS/SiteAssets/Lists/Noticias/NewForm/imagen2React.jpg" alt="imagen2React.jpg" style="margin&#58;5px;" /><span id="ms-rterangecursor-start"></span><span id="ms-rterangecursor-end"></span><br></div>';
    return img.getElementsByTagName('img')[0].getAttribute("src");
}

  public render(): React.ReactElement<IReactCrudProps> {
    const items: JSX.Element[] = this.state.items.map((item: IListItem, i: number): JSX.Element => {
      
      return (
         /*<Card className="col-md-3 card-row">
        <CardImg variant="top" style={{ height: '100%' }}  src={this._renderCurrencies(item.imagen)}  alt="Card image cap" />
        <CardBody>
          <CardTitle>{item.Title}</CardTitle>
          <CardText>{item.descripcion}</CardText>
        </CardBody>
        <CardFooter>
          <small className="text-muted">Fecha de publicación</small>
        </CardFooter>
      </Card>*/
      <div className="col-md-3" style={{position:'relative'}}>
        <img src={this._renderCurrencies(item.imagen)} className={styles.imgsize} alt="undefined"/>
        <div className={styles.thumbnail}>
          <p style={{background:'#97c93d'}}>{item.Title}</p>
        </div>
        <h3 className={styles.description}>{item.descripcion}</h3>
      </div>
      
       );
    });

    const disabled = this.listNotConfigured(this.props); 
    console.log(this.state);
    
    return (
    
         <div>
            <div className={ styles.reactCrud }>
              <div className="row">
                {items}
              </div>
            </div>
            </div>
          
    );
  }


private readItems(): void {
    this.setState({
      status: 'Loading all items...',
      items: []
    });
    this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$select=Title,Id,descripcion,imagen`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      })
      .then((response: SPHttpClientResponse): Promise<{ value: IListItem[] }> => {
        return response.json();
      })
      .then((response: { value: IListItem[] }): void => {
        this.setState({
          status: `Successfully loaded ${response.value.length} items`,
          items: response.value
        });
      }, (error: any): void => {
        this.setState({
          status: 'Loading all items failed with error: ' + error,
          items: []
        });
      });
  }

  private listNotConfigured(props: IReactCrudProps): boolean {
    return props.listName === undefined ||
      props.listName === null ||
      props.listName.length === 0;
  }

  
}

