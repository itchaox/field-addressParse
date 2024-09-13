// FIXME 银行卡号解析

import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';
import { searchCardBin } from 'bankcard';

import AddressParse from './utils/address/parse/index';

const { t } = field;

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['api.exchangerate-api.com']);

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        source: '选择待解析的字段',
        p1: '请选择文本类型字段',
        p2: '收件人',
        p3: '联系电话',
        p4: '省市区',
        p5: '详细地址',
        p6: '省份',
        p7: '城市',
        p8: '区县',
        p9: '邮编',
        p10: '省市区编号',
      },
      'en-US': {
        source: 'Select the field to parse',
        p1: 'Please select a text field',
        p2: 'Recipient',
        p3: 'Contact number',
        p4: 'Province/City/District',
        p5: 'Detailed address',
        p6: 'Province',
        p7: 'City',
        p8: 'District/County',
        p9: 'Postal code',
        p10: 'Province/City/District code',
      },
      'ja-JP': {
        source: '解析するフィールドを選択してください',
        p1: 'テキストフィールドを選択してください',
        p2: '受取人',
        p3: '連絡先番号',
        p4: '都道府県/市区町村',
        p5: '詳細住所',
        p6: '都道府県',
        p7: '市',
        p8: '区/郡',
        p9: '郵便番号',
        p10: '都道府県/市区町村コード',
      },
    },
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'source',
      label: t('source'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text],
        placeholder: t('p1'),
      },
      validator: {
        required: true,
      },
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light:
          'https://lf3-static.bytednsdoc.com/obj/eden-cn/abjayvoz/ljhwZthlaukjlkulzlp/2024q3/Group%201321317613.png',
      },
      properties: [
        {
          key: 'person',
          primary: true,
          isGroupByKey: true,
          type: FieldType.Text,
          title: t('p2'),
        },
        {
          key: 'phone',
          type: FieldType.Text,
          title: t('p3'),
        },
        {
          key: 'area',
          type: FieldType.Text,
          title: t('p4'),
        },
        {
          key: 'address',
          type: FieldType.Text,
          title: t('p5'),
        },
        {
          key: 'province',
          type: FieldType.Text,
          title: t('p6'),
        },
        {
          key: 'city',
          type: FieldType.Text,
          title: t('p7'),
        },
        {
          key: 'district',
          type: FieldType.Text,
          title: t('p8'),
        },
        {
          key: 'postCode',
          type: FieldType.Text,
          title: t('p9'),
        },
        {
          key: 'areaCode',
          type: FieldType.Text,
          title: t('p10'),
        },
      ],
    },
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams) => {
    const { source } = formItemParams;

    // 数字类型 source 直接为值
    //  文本类型 source 为 [{ type: 'text , text '8'}]
    const valueStr = Array.isArray(source) && source.length > 0 && source.map((item) => item.text).join('');
    const [result] = AddressParse.parse(valueStr);

    let phoneStr = result.mobile || result.phone;
    if (result.phone && result.mobile) {
      phoneStr = [result.mobile, result.phone].join(',');
    }

    try {
      return {
        code: FieldCode.Success,
        data: {
          person: result.name || '-',
          phone: phoneStr,
          area: `${result.province}${result.city}${result.area}`,
          address: result.details,
          postCode: result.zip_code,
          areaCode: result.code,
          province: result.province,
          city: result.city,
          district: result.area,
        },
      };
    } catch (e) {
      return {
        code: FieldCode.Error,
      };
    }
  },
});
export default basekit;
