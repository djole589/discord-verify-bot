const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const ROLE_ID = '1481013079096692826';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`✅ Online: ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: '🌋 Survive Volcano For Eggs', type: 3 }],
    status: 'online'
  });
});

client.on('messageCreate', async (message) => {
  if (message.content === '!setup' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

    const embed = new EmbedBuilder()
      .setTitle('✦ Verification')
      .setDescription(
        '> Welcome to **Survive Volcano For Eggs**!\n\n' +
        'Click the button below to confirm you\'re not a bot and gain full access to the server.\n\n' +
        '**📋 Rules**\n By clicking the button you accept our server rules.\n\n' +
        '**⏱️ Quick**\n Verification takes less than a second.'
      )
      .setColor(0x5865F2)
      .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
      .setFooter({ 
        text: '🌋 Survive Volcano For Eggs • Verification', 
        iconURL: message.guild.iconURL() 
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('verify_btn')
        .setLabel('✅  Verify')
        .setStyle(ButtonStyle.Primary)
    );

    await message.channel.send({ embeds: [embed], components: [row] });
    await message.delete();
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton() || interaction.customId !== 'verify_btn') return;

  if (interaction.member.roles.cache.has(ROLE_ID)) {
    return interaction.reply({ 
      content: '✅ You are already verified! Enjoy the server 🌋', 
      ephemeral: true 
    });
  }

  try {
    await interaction.member.roles.add(ROLE_ID);
    await interaction.reply({
      content: '🎉 **Verification successful!**\nWelcome to **Survive Volcano For Eggs**! 🌋\nYou now have full access to the server.',
      ephemeral: true
    });
    console.log(`✅ Verified: ${interaction.user.tag}`);
  } catch (err) {
    console.error(err);
    await interaction.reply({ 
      content: '❌ Something went wrong! Please contact an admin.', 
      ephemeral: true 
    });
  }
});

client.login(process.env.TOKEN);
