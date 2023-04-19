import React from 'react';
import './App.css';

import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/react'
import { Form,FormGrid, FormItem, Input, NumberPicker,DatePicker,Select,Cascader,TreeSelect,Radio} from '@formily/antd'
import { action } from '@formily/reactive'
import { Card, Button } from 'antd'

const form=createForm({validateFirst:true})
const SchemaField=createSchemaField({
  components:{
    FormItem,
    Input,
    DatePicker,
    Select,
    NumberPicker,
    Cascader,
    FormGrid,
    TreeSelect,
    Radio
  },
  scope:{
    loadCards:(field: any)=>{
    
      const fetchCards=  ()=>{
        return new Promise((resolve)=>{
          setTimeout(()=>{
            resolve([
              {
                label:'黑金卡',
                value:'blackGold',
              },{
                label:'钻石卡',
                value:'diamond',
              },{
                label:'铂金卡',
                value:'platnium',
              },{
                label:'黄金卡',
                value:'gold',
              },{
                label:'白银卡',
                value:'silver'
              }
            ])
          },1000)
        })
      }
      field.loading=true
      if(action.bound)
      fetchCards().then(
        action.bound( (data) =>{
          field.dataSource=data
          field.loading=false
        })
      )
    },
    loadStores:(field:any)=>{
      const fetchSores=()=>{
        return new Promise((resolve)=>{
          setTimeout(()=>{
            resolve([
              {
                title: 'Node1',
                value: '0-0',
                children: [
                  {
                    title: 'Child Node1',
                    value: '0-0-1',
                  },
                  {
                    title: 'Child Node2',
                    value: '0-0-2',
                  },
                ],
              },
              {
                title: 'Node2',
                value: '0-1',
              },
            
            ])
          },1000)
        })
      }
      field.loading=true
      if(action.bound)
        fetchSores().then(
          action.bound((data)=>{
            field.dataSource=data
            field.loading=false
          })
        )
    },
    pendAllSelect:(field:any)=>{
      const allSelect=field.query('allSelect').get('value')
      if(allSelect){
        field.value=JSON.parse(JSON.stringify( field.dataSource))
        field.disabled=true
      }else{
        field.disabled=false
      }
    }
  }
})
const schema={
  type:"object",
  properties:{
    activityName:{
      type:"string",
      title:"活动名称",
      required:true,
      'x-decorator':"FormItem",
      'x-component':'Input',
      
    },
    card:{
      type:"string",
      title:"活动卡类型",
      required:true,
      'x-decorator':'FormItem',
      'x-component':'Select',
      'x-component-props': {
        style: {
          width: 900,
        },
      },
      'x-reactions':['{{loadCards}}'],
    },
    stores:{
      type:"void",
      title:"活动门店",
      "x-decorator":"FormItem",

      'x-decorator-props': {
        asterisk: true,
        feedbackLayout: 'none',
      },
      'x-component': 'FormGrid',
      properties:{
        allSelect:{
          type:"Boolean",
          title:"选择门店",
          enum:[
            {
              label:'全部门店',
              value:true
            },
            {
              label:'部分门店',
              value:false
            }
          ],
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
        },
        storeSelected:{
          type:"array",
          required:true,
          'x-decorator':'FormItem',
          'x-component':'TreeSelect',
          'x-component-props':{
            multiple:true,
            style: {
              width: 900,
            },
          },
          'x-reactions':['{{loadStores}}','{{pendAllSelect}}']
        }
      }
    },
    textarea: {
      type: 'string',
      title: '活动描述',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        style: {
          width: 900,
        },
      },
    }
  },
}
export default ()=>(
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      background: '#eee',
      padding: '40px 0',
    }}
  >
    <Card title="活动创建" style={{width:1080}}>
      <FormProvider
      form={form}
      >
        
        <SchemaField schema={schema} />
      </FormProvider>
    </Card>
  </div>
);