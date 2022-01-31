export const pageMock = {
  object: "page",
  id: "hogehoge",
  created_time: "2022-01-31T01:42:00.000Z",
  last_edited_time: "2022-01-31T09:57:00.000Z",
  cover: {
    type: "external",
    external: {
      url: "https://emoji.slack-edge.com/T04RUP72R/pien-nya/9f2d8ec627b3e5cc.png",
    },
  },
  icon: null,
  parent: {
    type: "database_id",
    database_id: "fugafuga",
  },
  archived: false,
  properties: {
    Assign: {
      id: "b=A^",
      type: "people",
      people: [
        {
          object: "user",
          id: "user_id_hogehoge",
          name: "丹波 凛",
          avatar_url:
            "https://emoji.slack-edge.com/T04RUP72R/rin-chan/ad7b71d2037228a2.png",
          type: "person",
          person: {
            email: "tamba.Rin@tam-bourine.co.jp",
          },
        },
      ],
    },
    Name: {
      id: "title",
      type: "title",
      title: [
        {
          type: "text",
          text: {
            content: "丹波 凛",
            link: null,
          },
          annotations: {
            bold: true,
            italic: false,
            strikethrough: false,
            underline: true,
            code: true,
            color: "default",
          },
          plain_text: "丹波 凛",
          href: null,
        },
      ],
    },
  },
  url: "https://www.notion.so/examplelink",
};
